# 1단계: 애플리케이션 빌드

# Node.js 20.10.0 버전의 이미지 사용, 이 단계를 'builder'로 명명
FROM node:20.10.0 AS builder

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# package.json과 package-lock.json 파일을 컨테이너로 복사
COPY package*.json ./

# npm을 사용하여 의존성 설치
RUN npm install

# 현재 디렉토리의 모든 파일을 컨테이너의 작업 디렉토리로 복사
COPY . .

# 프로젝트 빌드 실행, 실패 시 종료
RUN npm run build || exit 1

# 2단계: 빌드된 애플리케이션 실행

# Node.js 20.10.0 버전의 이미지 사용
FROM node:20.10.0

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 빌드된 애플리케이션의 dist 폴더를 이전 단계에서 현재 컨테이너로 복사
COPY --from=builder /app/dist /app/dist

# 전역으로 serve 패키지 설치
RUN npm install -g serve

# 컨테이너의 5173 포트를 외부에 노출
EXPOSE 5173

# 컨테이너 시작 시 실행할 명령어 설정
ENTRYPOINT ["serve", "-l", "5173", "-s", "dist"]