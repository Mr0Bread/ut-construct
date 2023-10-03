import * as react from 'react';
import { ReactNode } from 'react';
import { FileRouter, inferEndpointInput } from 'uploadthing/server';
import { UploadthingComponentProps } from '@uploadthing/react/src/types';
import { UploadFileResponse } from 'uploadthing/client';

declare const ErrorCode: {
    readonly FILE_INVALID_TYPE: "FILE_INVALID_TYPE";
    readonly FILE_TOO_LARGE: "FILE_TOO_LARGE";
    readonly FILE_TOO_SMALL: "FILE_TOO_SMALL";
    readonly TOO_MANY_FILES: "TOO_MANY_FILES";
};
type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

type AcceptProp = Record<string, string[]>;

type DropEvent = React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement> | DragEvent | Event;
type FileError = {
    message: string;
    code: ErrorCode | (string & {});
};
interface FileRejection {
    file: File;
    errors: FileError[];
}
type DropzoneOptions = Pick<React.HTMLProps<HTMLElement>, "multiple" | "onDragEnter" | "onDragOver" | "onDragLeave"> & {
    accept?: AcceptProp;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
    preventDropOnDocument?: boolean;
    noClick?: boolean;
    noKeyboard?: boolean;
    noDrag?: boolean;
    noDragEventsBubbling?: boolean;
    disabled?: boolean;
    onDrop?: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
    onDropAccepted?: <T extends File>(files: T[], event: DropEvent) => void;
    onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
    getFilesFromEvent?: (event: DropEvent) => Promise<(File | DataTransferItem)[]>;
    onFileDialogCancel?: () => void;
    onFileDialogOpen?: () => void;
    onError?: (err: Error) => void;
    validator?: <T extends File>(file: T) => FileError | FileError[] | null;
    useFsAccessApi?: boolean;
    autoFocus?: boolean;
};
type DropzoneState = {
    isFocused: boolean;
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFileDialogActive: boolean;
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    rootRef: React.RefObject<HTMLElement>;
    inputRef: React.RefObject<HTMLInputElement>;
};
type DropzoneMethods = {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    open: null | (() => void);
};
interface DropzoneRootProps extends React.HTMLAttributes<HTMLElement> {
    refKey?: string;
    [key: string]: any;
}
interface DropzoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    refKey?: string;
}

/**
 * This is a forked version of the react-dropzone package.
 * See original source here: https://github.com/react-dropzone/react-dropzone
 * The original package is licensed under the MIT license.
 */

/**
 * A React hook that creates a drag 'n' drop area.
 *
 * ### Example
 *
 * ```tsx
 * function MyDropzone() {
 *   const { getRootProps, getInputProps } = useDropzone({
 *     onDrop: acceptedFiles => {
 *       // do something with the File objects, e.g. upload to some server
 *     }
 *   });
 *
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       <p>Drag and drop some files here, or click to select files</p>
 *     </div>
 *   )
 * }
 * ```
 */
declare function useDropzone(props: DropzoneOptions): DropzoneState & DropzoneMethods;

type UploadRootProps<TRouter extends FileRouter> = UploadthingComponentProps<TRouter> & {
    children: JSX.Element | JSX.Element[];
};
type UploadTriggerProps<TRouter extends FileRouter> = {};
declare const generateConstruct: <TRouter extends FileRouter>() => {
    UploadRoot: (props: FileRouter extends TRouter ? "Where's the generic lebowski" : UploadRootProps<TRouter>) => JSX.Element;
    UploadTrigger: ({ render, children, className }: {
        render?: ((opts: {
            endpoint: UploadthingComponentProps<TRouter>["endpoint"];
            files: File[];
            setFiles: (files: File[]) => void;
            startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
            isUploading: boolean;
            setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
            dropzoneHelpers?: (DropzoneState & DropzoneMethods) | undefined;
            input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
            fileTypes: string[];
            multiple: boolean;
            isReady: boolean;
            allowedContentTextLabel: string;
        } & {
            onClick: () => void;
            getDefaultButtonText: () => string;
            getDefaultClasses: () => string;
        }) => ReactNode) | undefined;
        children?: ReactNode;
        className?: string | undefined;
    }) => string | number | boolean | JSX.Element | react.ReactFragment | null | undefined;
    DropzoneRoot: ({ children, render, className, appearance }: {
        children?: ReactNode | ReactNode[];
        render?: ((opts: {
            endpoint: UploadthingComponentProps<TRouter>["endpoint"];
            files: File[];
            setFiles: (files: File[]) => void;
            startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
            isUploading: boolean;
            setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
            dropzoneHelpers?: (DropzoneState & DropzoneMethods) | undefined;
            input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
            fileTypes: string[];
            multiple: boolean;
            isReady: boolean;
            allowedContentTextLabel: string;
        } & {
            getDefaultClasses: () => string;
            getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
        }) => ReactNode) | undefined;
        className?: string | undefined;
        appearance?: {
            noBtn?: boolean | undefined;
        } | undefined;
    }) => string | number | boolean | JSX.Element | react.ReactFragment | null | undefined;
    DropzoneInput: () => JSX.Element;
    RootContext: react.Context<{
        endpoint: UploadthingComponentProps<TRouter>["endpoint"];
        files: File[];
        setFiles: (files: File[]) => void;
        startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
        isUploading: boolean;
        setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
        dropzoneHelpers?: (DropzoneState & DropzoneMethods) | undefined;
        input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
        fileTypes: string[];
        multiple: boolean;
        isReady: boolean;
        allowedContentTextLabel: string;
    }>;
    Textarea: (props: React.TextareaHTMLAttributes<any>) => JSX.Element;
    FileGallery: ({ render }: {
        render?: ((opts: {
            endpoint: UploadthingComponentProps<TRouter>["endpoint"];
            files: File[];
            setFiles: (files: File[]) => void;
            startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
            isUploading: boolean;
            setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
            dropzoneHelpers?: (DropzoneState & DropzoneMethods) | undefined;
            input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
            fileTypes: string[];
            multiple: boolean;
            isReady: boolean;
            allowedContentTextLabel: string;
        } & {
            getDefaultClasses: () => string;
            renderFile: (file: File) => ReactNode;
        }) => ReactNode) | undefined;
    }) => string | number | boolean | JSX.Element | react.ReactFragment | null | undefined;
};

export { UploadRootProps, UploadTriggerProps, generateConstruct };
