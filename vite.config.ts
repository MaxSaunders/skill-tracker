import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/skill-tracker',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// // vite.config.ts
// import path from "path";
// import { defineConfig } from "file:///F:/Coding/skill-tracker/node_modules/vite/dist/node/index.js";
// import react from "file:///F:/Coding/skill-tracker/node_modules/@vitejs/plugin-react-swc/index.mjs";
// var __vite_injected_original_dirname = "F:\\Coding\\skill-tracker";
// var vite_config_default = defineConfig({
//   plugins: [react()],
//   base: "/skill-tracker",
//   resolve: {
//     alias: {
//       "@": path.resolve(__vite_injected_original_dirname, "./src")
//     }
//   }
// });
// export {
//   vite_config_default as default
// };
// //# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxDb2RpbmdcXFxcc2tpbGwtdHJhY2tlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcQ29kaW5nXFxcXHNraWxsLXRyYWNrZXJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L0NvZGluZy9za2lsbC10cmFja2VyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIGJhc2U6ICcvc2tpbGwtdHJhY2tlcicsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsT0FBTyxVQUFVO0FBQzlRLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
