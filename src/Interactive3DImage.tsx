import React, { useEffect, useRef } from 'react';
import { Application, Sprite, Texture } from 'pixi.js';
import { DisplacementFilter } from '@pixi/filter-displacement';

interface Interactive3DImageProps {
  image: string; // 원본 이미지 경로
  depthMap: string; // Depth map 이미지 경로
  width?: number; // 외부에서 전달받은 이미지 너비
  height?: number; // 외부에서 전달받은 이미지 높이
}

const Interactive3DImage: React.FC<Interactive3DImageProps> = ({
  image,
  depthMap,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application({
      view: canvas, // PixiJS에서 사용할 canvas 전달
      width: width || 100, // 임시값, 이미지 크기 계산 후 업데이트
      height: height || 100, // 임시값
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    const loadImages = async () => {
      const imgTexture = await Texture.fromURL(image);
      const depthMapTexture = await Texture.fromURL(depthMap);

      const img = new Sprite(imgTexture);
      const depthMapSprite = new Sprite(depthMapTexture);

      // 이미지 크기 추출 또는 외부 값 사용
      const imgWidth = width || imgTexture.width;
      const imgHeight = height || imgTexture.height;

      // 이미지와 Depth map 크기 설정
      img.width = imgWidth;
      img.height = imgHeight;

      depthMapSprite.width = imgWidth;
      depthMapSprite.height = imgHeight;

      // Displacement 필터 적용
      const displacementFilter = new DisplacementFilter(depthMapSprite);

      // PixiJS 스테이지 구성
      app.renderer.resize(imgWidth, imgHeight);
      app.stage.addChild(img);
      app.stage.addChild(depthMapSprite);
      app.stage.filters = [displacementFilter];

      // 마우스 이동 이벤트
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        displacementFilter.scale.x = (imgWidth / 2 - mouseX) / 20;
        displacementFilter.scale.y = (imgHeight / 2 - mouseY) / 20;
      };

      canvas.addEventListener('mousemove', handleMouseMove);

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        app.destroy(true, { children: true });
      };
    };

    loadImages().catch((error) => {
      console.error('Error loading images:', error);
    });
  }, [image, depthMap, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
      }}
    />
  );
};

export default Interactive3DImage;
