'use client'

import { generateConstruct } from '@uploadthing-construct/react'
import type { OurFileRouter } from '~/uploadthing';

const {
    UploadRoot,
    DropzoneRoot,
    DropzoneInput,
    UploadTrigger,
    Textarea,
    FileGallery,
} = generateConstruct<OurFileRouter>()

export default function Page() {
    return (
        <main
            className='flex flex-row justify-center mt-10'
        >
            <div
                className='w-full max-w-3xl flex flex-col items-center'
            >
                <UploadRoot
                    endpoint='imageUploader'
                >
                    <Textarea />
                    <FileGallery />
                    <UploadTrigger />
                </UploadRoot>
            </div>
        </main>
    );
}