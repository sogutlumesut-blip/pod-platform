import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';

export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 500,
            height: 700,
            backgroundColor: '#ffffff',
            selection: true,
            preserveObjectStacking: true,
        });

        setCanvas(fabricCanvas);

        // Initial Resize Logic or Responsive scaling can go here

        return () => {
            fabricCanvas.dispose();
        };
    }, []);

    const addText = useCallback((text: string) => {
        if (!canvas) return;
        const textBox = new fabric.Textbox(text, {
            left: 100,
            top: 100,
            fontSize: 40,
            fontFamily: 'Inter', // Make sure this font is loaded or use Arial
            fill: '#000000',
        });
        canvas.add(textBox);
        canvas.setActiveObject(textBox);
        canvas.requestRenderAll();
    }, [canvas]);

    const addImage = useCallback(async (url: string) => {
        if (!canvas) return;
        try {
            const img = await fabric.Image.fromURL(url);
            img.scaleToWidth(200);
            img.set({
                cornerColor: '#FF6B55',
                cornerStyle: 'circle',
                transparentCorners: false,
                cornerSize: 10
            });
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
        } catch (error) {
            console.error("Failed to add image to canvas:", error);
        }
    }, [canvas]);

    const deleteSelected = useCallback(() => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
            canvas.discardActiveObject();
            activeObjects.forEach((obj: fabric.Object) => {
                canvas.remove(obj);
            });
            canvas.requestRenderAll();
        }
    }, [canvas]);

    return {
        canvasRef,
        canvas,
        addText,
        addImage, // We will hook this up to the upload button
        deleteSelected
    };
};
