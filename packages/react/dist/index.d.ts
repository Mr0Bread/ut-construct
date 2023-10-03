import "./styles.css";
import { type ReactNode } from 'react';
import type { FileRouter, inferEndpointInput } from 'uploadthing/server';
import type { UploadthingComponentProps } from '@uploadthing/react/src/types';
import { useDropzone } from './use-dropzone';
import { type UploadFileResponse } from "uploadthing/client";
export type UploadRootProps<TRouter extends FileRouter> = UploadthingComponentProps<TRouter> & {
    children: JSX.Element | JSX.Element[];
};
export type UploadTriggerProps<TRouter extends FileRouter> = {};
export declare const generateConstruct: <TRouter extends FileRouter>() => {
    UploadRoot: (props: FileRouter extends TRouter ? "Where's the generic lebowski" : UploadRootProps<TRouter>) => JSX.Element;
    UploadTrigger: ({ render, children, className }: {
        render?: ((opts: {
            endpoint: UploadthingComponentProps<TRouter>["endpoint"];
            files: File[];
            setFiles: (files: File[]) => void;
            startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
            isUploading: boolean;
            setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
            dropzoneHelpers?: (import("./use-dropzone").DropzoneState & import("./use-dropzone").DropzoneMethods) | undefined;
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
    }) => string | number | boolean | import("react").ReactFragment | JSX.Element | null | undefined;
    DropzoneRoot: ({ children, render, className, appearance }: {
        children?: ReactNode | ReactNode[];
        render?: ((opts: {
            endpoint: UploadthingComponentProps<TRouter>["endpoint"];
            files: File[];
            setFiles: (files: File[]) => void;
            startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
            isUploading: boolean;
            setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
            dropzoneHelpers?: (import("./use-dropzone").DropzoneState & import("./use-dropzone").DropzoneMethods) | undefined;
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
    }) => string | number | boolean | import("react").ReactFragment | JSX.Element | null | undefined;
    DropzoneInput: () => JSX.Element;
    RootContext: import("react").Context<{
        endpoint: UploadthingComponentProps<TRouter>["endpoint"];
        files: File[];
        setFiles: (files: File[]) => void;
        startUpload: (files: File[], input: undefined | any) => Promise<UploadFileResponse[] | undefined>;
        isUploading: boolean;
        setDropzoneHelpers: (helpers: ReturnType<typeof useDropzone>) => void;
        dropzoneHelpers?: (import("./use-dropzone").DropzoneState & import("./use-dropzone").DropzoneMethods) | undefined;
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
            dropzoneHelpers?: (import("./use-dropzone").DropzoneState & import("./use-dropzone").DropzoneMethods) | undefined;
            input: inferEndpointInput<TRouter[keyof TRouter]> | undefined;
            fileTypes: string[];
            multiple: boolean;
            isReady: boolean;
            allowedContentTextLabel: string;
        } & {
            getDefaultClasses: () => string;
            renderFile: (file: File) => ReactNode;
        }) => ReactNode) | undefined;
    }) => string | number | boolean | import("react").ReactFragment | JSX.Element | null | undefined;
};
//# sourceMappingURL=index.d.ts.map