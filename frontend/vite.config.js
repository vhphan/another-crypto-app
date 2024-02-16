import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {quasar, transformAssetUrls} from '@quasar/vite-plugin';
import {fileURLToPath, URL} from "url";
import {basePath} from './config';
import {Loading} from "quasar";

export default defineConfig({

    plugins: [
        vue({
            template: {transformAssetUrls}
        }),
        quasar({
            sassVariables: 'src/quasar-variables.sass',
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        // 😂💘💩
    },
    base: basePath,
    // server: {
    //   host: '0.0.0.0'
    // }

});

