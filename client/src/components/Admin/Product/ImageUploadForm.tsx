"use client";
import React, {useCallback, useEffect, useState} from "react";
import ImagePreview from "@/components/Admin/Product/ImagePreview";
import {useDropzone} from "react-dropzone";
import {useProductImageStore} from "@/store/productImageStore";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";


export interface ImageType {
    dataUrl: string; //blob or aws full path
    uploadKey?: string; //file key
    file: File | undefined;
    id: number; //drag and drop
    size: number | undefined;
}


const ImageUploadForm = () => {
    const productImageStore = useProductImageStore();
    const [images, setImages] = useState<Array<ImageType>>([]);
    const [hoveredImg, setHoveredImg] = useState<string>('');
    const [imgIdxEnd, setImgIdxEnd] = useState<number>(0);

    const {getRootProps, getInputProps, open} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles:10,
        // maxSize:2000000,
        onDrop: acceptedFiles => {
            setImages((prev) => {

                return prev.concat(acceptedFiles.map((file, index) => {
                        return Object.assign(file, {
                            dataUrl: URL.createObjectURL(file), file, id: imgIdxEnd + index
                        })
                    }
                ));
            });
        }
    });

    const deleteImage = useCallback((image: string) => {
        const index = images.findIndex(img => img?.dataUrl === image);
        setImages((images) => {
            const prev = [...images] as Array<ImageType>;
            prev.splice(index, 1);
            return prev;
        });

    },[images]);

    const handleMouseOver= (image: string)=> {
        setHoveredImg(image);
    }

    const handleMouseOut= (image: string)=> {
        setHoveredImg('');
    }

    const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {

        //삭제 & 삽입
        setImages((prevImage) => {
            //불변성 유지
            const updatedImages = [...prevImage]; // 배열을 복사해서 새로운 배열을 생성
            const [draggedItem] = updatedImages.splice(dragIndex, 1); // 복사된 배열에서 항목을 제거
            updatedImages.splice(hoverIndex, 0, draggedItem); // 새로운 배열에 항목을 추가
            return updatedImages;  // 복사된 새로운 배열을 반환
        });


    }, [images]);

    useEffect(() => {
        setImgIdxEnd(images.length);
        productImageStore.setFiles(images); //files에 저장됨 ..

    },[images]);

    useEffect(() => {

        setImages(productImageStore.files);

        return () => {
            if(images && images.length > 0) {
                images.map(image => URL.revokeObjectURL(image?.dataUrl as string));
            }

            productImageStore.clear();
        };
    }, []);

    return (
        <div className="flex flex-col gap-7">
            {/* 상단 영역: 커버 이미지와 썸네일 영역 */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* 왼쪽 - 커버 이미지 */}
                <div className="relative flex-shrink-0">
                    <DndProvider backend={HTML5Backend}>
                        {images[0] && (
                            <ImagePreview
                                key={images[0].id}
                                moveImage={moveImage}
                                id={images[0].id}
                                index={0}
                                image={images[0].dataUrl}
                                deleteImage={deleteImage}
                                hoveredImg={hoveredImg}
                                handleMouseOver={handleMouseOver}
                                handleMouseOut={handleMouseOut}
                            />
                        )}
                    </DndProvider>
                </div>
                {/* 오른쪽 - 썸네일 영역 (썸네일이 커버 이미지 높이에 맞게 자동 줄바꿈) */}
                <div className="flex flex-wrap gap-4">
                    <DndProvider backend={HTML5Backend}>
                        {images.slice(1).map((image, idx) => (
                            <div key={image.id}>
                                <ImagePreview
                                    moveImage={moveImage}
                                    id={image.id}
                                    index={idx + 1}
                                    image={image.dataUrl}
                                    deleteImage={deleteImage}
                                    hoveredImg={hoveredImg}
                                    handleMouseOver={handleMouseOver}
                                    handleMouseOut={handleMouseOut}
                                />
                            </div>
                        ))}
                    </DndProvider>
                </div>
            </div>

            {/* 파일 업로드 섹션 */}
            <section>
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center w-full h-64 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default ImageUploadForm;