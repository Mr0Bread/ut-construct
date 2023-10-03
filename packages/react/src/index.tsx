import "./styles.css";
import { type ReactNode, useContext, useEffect, useState, createContext, useCallback, ReactElement, PropsWithChildren, useMemo, useRef } from 'react'
import type { FileRouter, inferEndpointInput } from 'uploadthing/server'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import type { UploadthingComponentProps } from '@uploadthing/react/src/types'
import { DropzoneOptions, FileWithPath, useDropzone } from './use-dropzone'
import { allowedContentTextLabelGenerator, generateClientDropzoneAccept, generatePermittedFileTypes, type UploadFileResponse } from "uploadthing/client";
import { twMerge } from 'tailwind-merge'

export type UploadRootProps<TRouter extends FileRouter> = UploadthingComponentProps<TRouter> & {
    children: JSX.Element | JSX.Element[]
}

export type UploadTriggerProps<TRouter extends FileRouter> = {

}

function getFilesFromClipboardEvent(event: ClipboardEvent) {
    const dataTransferItems = event.clipboardData?.items;
    if (!dataTransferItems) return;

    const files = Array.from(dataTransferItems).reduce<File[]>((acc, curr) => {
        const f = curr.getAsFile();
        return f ? [...acc, f] : acc;
    }, []);

    return files;
}

export const generateConstruct = <TRouter extends FileRouter>() => {
    const {
        useUploadThing
    } = generateReactHelpers<TRouter>()

    type RootContextType<TRouter extends FileRouter> = {
        endpoint: UploadthingComponentProps<TRouter>['endpoint'];
        files: File[];
        setFiles: (files: File[]) => void;
        startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
        isUploading: boolean;
        setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
        dropzoneHelpers?: ReturnType<typeof useDropzone>;
        input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
        fileTypes: string[];
        multiple: boolean;
        isReady: boolean;
        allowedContentTextLabel: string;
    }

    type FinalContextType = RootContextType<TRouter>

    const RootContext = createContext<FinalContextType>(
        {} as FinalContextType
    );

    RootContext.displayName = 'UtConstructContext';

    const DropzoneRoot = ({
        children,
        render,
        className,
        appearance
    }: {
        children?: ReactNode | ReactNode[];
        render?: (opts: FinalContextType & {
            getDefaultClasses: () => string,
            getRootProps: ReturnType<typeof useDropzone>['getRootProps']
        }) => ReactNode;
        className?: string;
        appearance?: {
            noBtn?: boolean;
        }
    }) => {
        const context = useContext(RootContext)
        const {
            setDropzoneHelpers,
            setFiles,
            fileTypes,
            isReady,
            allowedContentTextLabel,
            files
        } = context;

        const defaultOnDrop = useCallback(
            (acceptedFiles: FileWithPath[]) => {
                setFiles(acceptedFiles)
            },
            [setFiles]
        )

        const accept = useMemo(
            () => fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
            // shitty code? maybe. It works? yes. Am I proud of myself? Hell yeah
            // It is so that I don't need to bother with reference to array but compare actual values
            [fileTypes.join(';')]
        )
        const dropzoneProps = useMemo(
            (): DropzoneOptions => {
                return {
                    onDrop: defaultOnDrop,
                    accept
                };
            },
            [defaultOnDrop, accept]
        )
        const dropzone = useDropzone(dropzoneProps)

        useEffect(
            () => {
                setDropzoneHelpers(dropzone)
            },
            [dropzone]
        )

        const getDefaultClasses = () => {
            const defaultClasses = "mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center hover:bg-gray-100 transition-colors";

            return defaultClasses;
        }

        if (render) return render({
            ...context,
            getDefaultClasses,
            getRootProps: dropzone.getRootProps
        });

        if (children) {
            return (
                <div
                    {...dropzone.getRootProps()}
                    className={
                        twMerge(
                            getDefaultClasses(),
                            className
                        )
                    }
                >
                    {children}
                </div>
            );
        }

        return (
            <div
                {...dropzone.getRootProps()}
                className={
                    twMerge(
                        getDefaultClasses(),
                        className
                    )
                }
            >
                <DropzoneInput />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="mx-auto block h-12 w-12 align-middle text-gray-400"
                >
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                {
                    isReady
                        ? 'Choose files or drag and drop'
                        : 'Loading...'
                }
                <div
                    className="m-0 min-h-[1.25rem] text-xs leading-5 text-gray-600"
                >
                    {allowedContentTextLabel}
                </div>
                {
                    appearance?.noBtn
                        ? null
                        : files.length > 0
                            ? (
                                <UploadTrigger />
                            )
                            : null
                }
            </div>
        );
    }

    const DropzoneInput = () => {
        const {
            dropzoneHelpers
        } = useContext(RootContext)

        return (
            <input className="sr-only" {...dropzoneHelpers?.getInputProps()} />
        );
    }

    const UploadTrigger = ({
        render,
        children,
        className
    }: {
        render?: (opts: FinalContextType & {
            onClick: () => void;
            getDefaultButtonText: () => string;
            getDefaultClasses: () => string;
        }) => ReactNode;
        children?: ReactNode;
        className?: string
    }) => {
        const context = useContext(RootContext)
        const {
            startUpload,
            input,
            files,
            isUploading,
            multiple,
            isReady
        } = context;

        const defaultOnClick = useCallback(
            () => {
                if (!files.length) return;

                return startUpload(files, input)
            },
            [startUpload, files, input]
        )

        const getDefaultButtonText = () => {
            if (files.length) return `Upload ${files.length} file${files.length === 1 ? "" : "s"}`
            if (!isReady) return "Loading..."
            if (isUploading) return "Uploading"

            return `Choose File${multiple ? `(s)` : ``}`
        }

        const getDefaultClasses = () => {
            const defaultClasses = "relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 bg-blue-600 border-none cursor-pointer hover:bg-blue-500 transition-colors";

            if (!isReady) {
                return twMerge(
                    defaultClasses,
                    "bg-blue-400 cursor-not-allowed"
                )
            }

            return defaultClasses;
        }

        if (render) return render({
            ...context,
            onClick: defaultOnClick,
            getDefaultButtonText,
            getDefaultClasses
        });

        if (children) return (
            <button>
                {children}
            </button>
        );

        return (
            <button
                className={
                    twMerge(
                        getDefaultClasses(),
                        className
                    )
                }
                onClick={defaultOnClick}
            >
                {getDefaultButtonText()}
            </button>
        );
    }

    const FilePreviewCard = ({ file }: {
        file: File
    }) => {
        const {
            files,
            setFiles
        } = useContext(RootContext)
        const [isHovered, setIsHovered] = useState(false)

        const onMouseEnter = () => {
            setIsHovered(true)
        }

        const onMouseLeave = () => {
            setIsHovered(false)
        }

        const defaultOnClick = () => {
            setFiles(
                files.filter(
                    (f) => f !== file 
                )
            )
        }

        const getDefaultClasses = () => {
            const defaultClasses = "relative border border-gray-300 rounded cursor-pointer after:content-[''] after:absolute after:w-full after:h-full after:top-0 after:left-0 after:transition-colors"

            if (isHovered) {
                return twMerge(
                    defaultClasses,
                    "after:bg-gray-400/25"
                )
            }

            return defaultClasses;
        }

        const closeIcon = <svg fill="#000000" height="36px" width="36" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512" className="">
            <g>
                <g>
                    <polygon points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 
               512,452.922 315.076,256 		"/>
                </g>
            </g>
        </svg>

        const renderCloseIcon = () => {
            return (
                <div
                    className={
                        twMerge(
                            "opacity-0 transition-opacity absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur w-full h-full flex justify-center items-center",
                            isHovered ? "opacity-100" : null
                        )
                    }
                >
                    {closeIcon}
                </div>
            );
        }

        const isImage = file.type.includes('image')

        if (isImage) {
            return (
                <div
                    className={getDefaultClasses()}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={defaultOnClick}
                >
                    {renderCloseIcon()}
                    <img
                        className="w-[80px]"
                        src={URL.createObjectURL(file)}
                        alt={`preview of ${file.name}`}
                    />
                </div>
            );
        }

        return (
            <div
                className={
                    twMerge(
                        getDefaultClasses(),
                        "min-w-[80px] min-h-[80px] p-3"
                    )
                }
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={defaultOnClick}
            >
                {renderCloseIcon()}
                {file.name}
            </div>
        );
    }

    const FileGallery = ({
        render
    }: {
        render?: (opts: FinalContextType & {
            getDefaultClasses: () => string;
            renderFile: (file: File) => ReactNode;
        }) => ReactNode;
    }) => {
        const context = useContext(RootContext)
        const {
            files
        } = context;

        if (!files.length) return null;

        const getDefaultClasses = () => {
            const defaultClasses = "mt-4 flex flex-row gap-x-4"

            return defaultClasses;
        }

        const renderFile = (file: File) => {
            return <FilePreviewCard file={file} />
        }

        if (render) return render({
            ...context,
            getDefaultClasses,
            renderFile
        })

        return (
            <div
                className={getDefaultClasses()}
            >
                {files.map(renderFile)}
            </div>
        );
    }

    const Textarea = (props: React.TextareaHTMLAttributes<any>) => {
        const elemRef = useRef<HTMLTextAreaElement>(null)
        const {
            files,
            setFiles
        } = useContext(RootContext)

        useEffect(
            () => {
                const handlePaste = (event: ClipboardEvent) => {
                    event.preventDefault()
                    event.stopPropagation()

                    if (document.activeElement !== elemRef.current) {
                        // Upload from clipboard can be triggered only if button is focused
                        return;
                    }

                    const pastedFiles = getFilesFromClipboardEvent(event)

                    if (!pastedFiles) return;

                    setFiles([...files, ...pastedFiles]);
                }

                window.addEventListener("paste", handlePaste);

                return () => {
                    window.removeEventListener("paste", handlePaste);
                };
            }
        )

        const getDefaultClasses = () => {
            const defaultClasses = "block p-2.5 w-full text-base text-gray-900 border rounded"

            return defaultClasses;
        }

        return (
            <textarea
                placeholder="Write your text here"
                {...props}
                ref={elemRef}
                className={
                    twMerge(
                        getDefaultClasses(),
                        props.className
                    )
                }
            />
        );
    }

    const UploadRoot = (
        props: FileRouter extends TRouter
            ? "Where's the generic lebowski"
            : UploadRootProps<TRouter>
    ) => {
        const $props = props as unknown as UploadRootProps<TRouter>;
        const {
            endpoint,
            onClientUploadComplete,
            onUploadBegin,
            onUploadError,
            onUploadProgress,
            children,
        } = $props;
        const input = "input" in $props ? $props.input : undefined;
        const [droppedFiles, setDroppedFiles] = useState<File[]>([])
        const [dropzoneHelpers, setDropzoneHelpers] = useState<ReturnType<typeof useDropzone>>()
        const {
            isUploading,
            startUpload,
            permittedFileInfo
        } = useUploadThing(
            endpoint
        )

        const {
            fileTypes,
            multiple
        } = generatePermittedFileTypes(
            permittedFileInfo?.config
        )
        const allowedContentTextLabel = allowedContentTextLabelGenerator(permittedFileInfo?.config)

        const isReady = fileTypes.length > 0;

        type InferredInput = inferEndpointInput<TRouter[typeof endpoint]>;
        type FuncInput = undefined extends InferredInput
            ? [files: File[], input?: undefined]
            : [files: File[], input: InferredInput];

        return (
            <RootContext.Provider value={{
                endpoint: $props.endpoint as RootContextType<TRouter>['endpoint'],
                files: droppedFiles,
                setFiles: setDroppedFiles,
                startUpload: startUpload as (...args: FuncInput) => Promise<UploadFileResponse[] | undefined>,
                isUploading,
                setDropzoneHelpers,
                dropzoneHelpers,
                input,
                fileTypes,
                multiple,
                isReady,
                allowedContentTextLabel
            }}>
                {children}
            </RootContext.Provider>
        );
    }

    return {
        UploadRoot,
        UploadTrigger,
        DropzoneRoot,
        DropzoneInput,
        RootContext,
        Textarea,
        FileGallery
    };
}
