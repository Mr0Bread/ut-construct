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
    useUtConstruct
} = generateConstruct<OurFileRouter>()

export default function Page() {
    const {
        control,
        triggerUpload
    } = useUtConstruct({
        endpoint: "imageUploader"
    })

    return (
        <main
            className='flex flex-row justify-center mt-10'
        >
            <div
                className='w-full max-w-3xl flex flex-col items-center'
            >
                <UploadRoot
                    control={control}
                >
                    <Textarea />
                    <FileGallery />
                    <button
                        onClick={() => {
                            void triggerUpload()
                        }}
                        className="relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 bg-blue-600 border-none cursor-pointer hover:bg-blue-500 transition-colors"
                    >
                        Upload
                    </button>
                </UploadRoot>
            </div>
        </main>
    );
}