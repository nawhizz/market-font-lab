// PostCSS 설정을 함수 형태로 변경하여 from 옵션 자동 전달
export default (ctx) => {
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
};
