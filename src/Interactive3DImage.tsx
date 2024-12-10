import React, { useEffect, useRef } from 'react';
import { Application, Sprite, Texture } from 'pixi.js';
import { DisplacementFilter } from '@pixi/filter-displacement';

interface Interactive3DImageProps {
  image: string; // 원본 이미지 경로
  depthMap: string; // Depth map 이미지 경로
  width?: number; // 외부에서 전달받은 이미지 너비
  height?: number; // 외부에서 전달받은 이미지 높이
  intensity?: number; // 반응 강도 (기본값 10)
}

const Interactive3DImage: React.FC<Interactive3DImageProps> = ({
  image,
  depthMap,
  width,
  height,
  intensity = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loadImagesAndSetup = async () => {
      try {
        const imgTexture = await Texture.fromURL(image);
        const depthMapTexture = await Texture.fromURL(depthMap);

        const imgWidth = width || imgTexture.width;
        const imgHeight = height || imgTexture.height;

        // PixiJS Application 생성
        const app = new Application({
          view: canvas,
          width: imgWidth,
          height: imgHeight,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        const img = new Sprite(imgTexture);
        const depthMapSprite = new Sprite(depthMapTexture);

        // 이미지와 Depth map 크기 설정
        img.width = imgWidth;
        img.height = imgHeight;

        depthMapSprite.width = imgWidth;
        depthMapSprite.height = imgHeight;

        // Displacement 필터 적용
        const displacementFilter = new DisplacementFilter(depthMapSprite);

        // PixiJS 스테이지 구성
        app.stage.addChild(img);
        app.stage.addChild(depthMapSprite);
        app.stage.filters = [displacementFilter];

        // 페이지 전체에서 마우스 위치 추적
        const handleMouseMove = (e: MouseEvent) => {
          const mouseX = e.clientX / window.innerWidth; // 0 ~ 1로 정규화된 X 좌표
          const mouseY = e.clientY / window.innerHeight; // 0 ~ 1로 정규화된 Y 좌표

          // 정규화된 좌표를 이미지 크기에 맞게 스케일링
          const scaledX = (mouseX - 0.5) * imgWidth; // 중앙 기준으로 좌표 변환
          const scaledY = (mouseY - 0.5) * imgHeight;

          displacementFilter.scale.x = scaledX / intensity;
          displacementFilter.scale.y = scaledY / intensity;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // 컴포넌트 제거 시 이벤트 리스너 제거 및 PixiJS 인스턴스 제거
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          app.destroy(true, { children: true });
        };
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImagesAndSetup();
  }, [image, depthMap, width, height, intensity]);

  return <canvas ref={canvasRef} />;
};

export default Interactive3DImage;
