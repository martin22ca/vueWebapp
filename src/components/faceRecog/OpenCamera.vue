<template>
    <v-dialog v-model="dialog" width="auto">
        <v-card title="Informacion" prepend-icon="mdi-information-variant" style="font-size: large; min-width: 50vh;"
            align="start" rounded="true">
            <v-divider thickness="5"></v-divider>
            <v-card-text style="padding-left: 50px; font-size: 20px;">
                {{ dialogText }}
            </v-card-text>
            <v-card-item> <v-btn style="margin: 20px;" @click="dialog = false"> Ok</v-btn></v-card-item>
        </v-card>
    </v-dialog>
    <section class="display">
        <div class="text-overlay">
            <v-card :title="faceOn.value ? 'Persona detectada' : 'Persona No detectada'"
                :color="faceOn.value ? 'primary' : 'secondary'" variant="elevated" style="font-size: 30px;">
                <template v-slot:prepend>
                    <v-icon :icon="currentIcon" />
                </template>
                <template v-slot:subtitle>
                    <div style="font-size: 30px; padding: 5px;">
                        {{ faceOn.value ? currentInstruction : '' }}
                    </div>
                </template>
            </v-card>
        </div>
        <video ref="videoEl" autoplay="true" playsinline @loadedmetadata="runModel" style="transform: scaleX(-1);"  :class="shutterValue.val ? 'shutter' : ''" />
        <canvas ref="canvasEl" style="transform: scaleX(-1);" />
        <div class="bottom-bar">
            <v-card class="pa-4" color="transparent" variant="flat"
                style="display: flex; align-items: center;left: 0;right: 0; margin: auto;">
                <v-row>
                    <v-col>
                        <v-btn icon="mdi-arrow-left" class="BottomBtn" rounded="lg" variant="elevated"
                            @click="prevImage()"></v-btn>
                    </v-col>
                    <v-col>
                        <v-btn class="BottomBtn" rounded="lg" :icon="faceOn.value ? 'mdi-camera' : 'mdi-camera-off'"
                            variant="elevated" :color="faceOn.value ? 'primary' : 'secondary'" :disabled="!faceOn.value"
                            @click="takePhoto.value = true" />
                    </v-col>
                    <v-col>
                        <v-btn icon="mdi-arrow-right" class="BottomBtn" rounded="lg" variant="elevated"
                            @click="nextImage()" />
                    </v-col>
                    <v-col>
                        <v-btn class="BottomBtn mt-2" rounded="lg" prepend-icon="mdi-send" variant="elevated"
                            color="primary" @click="sendImages">
                            Enviar Fotos
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <div class="captured-images">
            <v-sheet width="200" class="ma-2" style="text-align: center;">
                <img v-if="currentImage != ''" :src="currentImage" />
                <img v-else src="@/assets/Placeholder.png" style="width: 200px;" />
                {{ currentImageIndex.value + 1 }} / 10
            </v-sheet>
        </div>
    </section>
</template>
  
<script>
import * as faceAPI from 'face-api.js'
import store from 'storejs';
import { useStore } from 'vuex'
import { axiosClient } from '@/plugins/axiosClient';
import { onMounted, onUnmounted, reactive, ref } from 'vue'
export default {
    name: 'Video',
    setup() {
        const initParams = reactive({
            modelUri: '/models',
            option: new faceAPI.SsdMobilenetv1Options({ minConfidence: 0.5 })
        })

        const constraints = reactive({
            video: {
                video: true,
                facingMode: 'environment'
            }
        })
        const storeX = useStore()
        const editedObj = storeX.state.editedObj
        const PADDING_PERCENTAGE = 0.02; // 5% padding
        const videoEl = ref(null)
        const canvasEl = ref(null)
        const dialog = ref(false);
        const dialogText = ref('');
        const capturedFaces = ref([
            { src: "", instruction: "Mirar Hacia Arriba", icon: 'mdi-arrow-up' },
            { src: "", instruction: "Mirar Hacia Arriba Derecha", icon: 'mdi-arrow-top-right' },
            { src: "", instruction: "Mirar Hacia Medio Derecha", icon: 'mdi-arrow-right' },
            { src: "", instruction: "Mirar Hacia Abajo Derecha", icon: 'mdi-arrow-bottom-right' },
            { src: "", instruction: "Mirar Hacia Abajo ", icon: 'mdi-arrow-down' },
            { src: "", instruction: "Mirar Hacia Abajo Izquierda", icon: 'mdi-arrow-bottom-left' },
            { src: "", instruction: "Mirar Hacia Medio Izquierda", icon: 'mdi-arrow-left' },
            { src: "", instruction: "Mirar Hacia Arriba Izquierda", icon: 'mdi-arrow-top-left' },
            { src: "", instruction: "Mirar Hacia Centro", icon: 'mdi-emoticon-neutral' },
            { src: "", instruction: "Mirar Hacia Centro Sonriendo", icon: 'mdi-emoticon' },
        ]);
        let currentImageIndex = reactive({ value: 0 })
        let shutterValue = reactive({ val: false })
        let currentImage = ref('')
        let currentInstruction = ref('')
        let currentIcon = ref('')
        currentIcon.value = capturedFaces.value[0].icon
        currentInstruction.value = capturedFaces.value[0].instruction
        let faceOn = reactive({ value: false })
        let takePhoto = reactive({ value: false })
        let stream = null;

        const runModel = async () => {
            const result = await faceAPI.detectSingleFace(videoEl.value, initParams.option)
            const ctx = canvasEl.value.getContext('2d')
            const canvasWidth = canvasEl.value.width
            const canvasHeight = canvasEl.value.height
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)

            if (result) {
                faceOn.value = true
                const { x, y, width, height } = result.box
                const camWidth = result.imageDims.width
                const camHeight = result.imageDims.height

                const scaleWidth = canvasWidth / camWidth
                const scaleHeight = canvasHeight / camHeight

                const paddingX = camWidth * PADDING_PERCENTAGE;
                const paddingY = camHeight * PADDING_PERCENTAGE;

                const correctX = (x * scaleWidth) - paddingX / 2;
                const correctY = (y * scaleHeight) - paddingY;
                const correctHeight = (height * scaleHeight) + (2 * paddingY);
                const correctWidth = (width * scaleWidth) + paddingX;

                drawResult(ctx, correctX, correctY, correctWidth, correctHeight)

                if (takePhoto.value) {
                    takePhoto.value = false
                    captureImage(x, y, width, height)
                }
            } else {
                faceOn.value = false
            }

            setTimeout(() => runModel())
        }

        const captureImage = async (correctX, correctY, correctWidth, correctHeight) => {
            const video = videoEl.value;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // Draw the video frame on the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Calculate the square bounding box
            const size = Math.max(correctWidth, correctHeight);
            const centerX = correctX + correctWidth / 2;
            const centerY = correctY + correctHeight / 2;
            const squareX = centerX - size / 2;
            const squareY = centerY - size / 2;

            // Create a new canvas to store the cropped face image
            const faceCanvas = document.createElement('canvas');
            faceCanvas.width = size;
            faceCanvas.height = size;
            const faceCtx = faceCanvas.getContext('2d');

            // Draw the pixels of the square bounding box onto the face canvas
            faceCtx.drawImage(canvas, squareX, squareY, size, size, 0, 0, size, size);

            // Resize the cropped face image to 200x200
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 200;
            resizedCanvas.height = 200;
            const resizedCtx = resizedCanvas.getContext('2d');
            resizedCtx.scale(-1, 1);
            resizedCtx.drawImage(faceCanvas, 0, 0, size, size, -200, 0, 200, 200);


            // Get the data URL of the resized face image and add it to the captured faces list
            if (capturedFaces.value[currentImageIndex.value].src == "") {
                capturedFaces.value[currentImageIndex.value].src = (resizedCanvas.toDataURL('image/jpeg', 0.8));
                if (currentImageIndex.value < 9) currentImageIndex.value++;
                currentImage.value = capturedFaces.value[currentImageIndex.value].src
                currentInstruction.value = capturedFaces.value[currentImageIndex.value].instruction
                currentIcon.value = capturedFaces.value[currentImageIndex.value].icon
            } else {
                capturedFaces.value[currentImageIndex.value].src = (resizedCanvas.toDataURL('image/jpeg', 0.8));
                currentImage.value = capturedFaces.value[currentImageIndex.value].src
            }
            console.log(shutterValue.val)
            shutterValue.val = true
            await new Promise(r => setTimeout(r, 500));
            shutterValue.val = false
        };

        const nextImage = () => {
            if (currentImageIndex.value < capturedFaces.value.length - 1) {
                currentImageIndex.value++;
            } else {
                currentImageIndex.value = 0
            }
            currentImage.value = capturedFaces.value[currentImageIndex.value].src
            currentInstruction.value = capturedFaces.value[currentImageIndex.value].instruction
            currentIcon.value = capturedFaces.value[currentImageIndex.value].icon
        };

        const prevImage = () => {
            if (currentImageIndex.value > 0) {
                currentImageIndex.value--;
            } else {
                currentImageIndex.value = capturedFaces.value.length - 1;
            }
            currentImage.value = capturedFaces.value[currentImageIndex.value].src
            currentInstruction.value = capturedFaces.value[currentImageIndex.value].instruction
            currentIcon.value = capturedFaces.value[currentImageIndex.value].icon
        };

        const drawResult = (ctx, correctX, correctY, correctWidth, correctHeight) => {
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 3
            ctx.strokeRect(correctX, correctY, correctWidth, correctHeight)
        }

        const sendImages = async () => {
            const accessToken = store.get('accessToken');
            if (capturedFaces.value.some(face => !face.src)) {
                dialogText.value = 'Las fotos estan incompletas. Porfavor tomar 10 fotos'
                dialog.value = true
                return null
            }
            const imagesToUpload = capturedFaces.value.filter((face) => face.src);

            const cleanPrevious = await axiosClient({
                method: 'put',
                timeout: 2000,
                url: "/students/clean",
                data: {
                    'accessToken': accessToken,
                    'idStud': editedObj.id_stud
                }
            })

            // Create an array of Promises that upload each image using Axios
            const uploadPromises = imagesToUpload.map((face) => axiosClient({
                method: 'post',
                timeout: 2000,
                url: "/students/ai",
                data: {
                    'accessToken': accessToken,
                    'image': face.src,
                    'idStud': editedObj.id_stud
                }
            }))

            // Wait for all Promises to resolve before executing any further code
            Promise.all(uploadPromises)
                .then((responses) => {
                    console.log('Images uploaded successfully:', responses);
                    dialogText.value = 'Las fotos se subieron Exitosamente!'
                    dialog.value = true
                })
                .catch((error) => {
                    console.log('Error uploading images:', error);
                    dialogText.value = 'Error de servidor. Porfavor intente mas tarde.'
                    dialog.value = true
                });

        }

        onMounted(() => {
            const initModel = async () => {
                await faceAPI.nets.ssdMobilenetv1.loadFromUri(initParams.modelUri)
            }
            const startStream = async () => {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints)
                    videoEl.value.srcObject = stream

                    const { clientWidth, clientHeight } = videoEl._value;
                    canvasEl.value.width = clientWidth
                    canvasEl.value.height = clientHeight;
                } catch (error) {
                    console.error(error.message)
                }
            }
            initModel()
            startStream()
        })

        onUnmounted(() => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        })

        return {
            dialog,
            shutterValue,
            dialogText,
            videoEl,
            canvasEl,
            currentImage,
            currentImageIndex,
            currentIcon,
            currentInstruction,
            takePhoto,
            faceOn,
            runModel,
            sendImages,
            nextImage,
            prevImage,
        }
    }
}
</script>
  
<style lang="scss" scoped>
.display {
    width: 100%;
    height: 70vh;
    position: relative;

    >video {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
        /* change the height value to 100% */
    }

    >canvas {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
        /* change the height value to 100% */
        top: 0;
        /* add top value to position canvas properly */
        left: 0;
        /* add left value to position canvas properly */
    }

    .text-overlay {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 20;
        color: white;
        font-size: 20px;
    }

    .bottom-bar {
        position: absolute;
        bottom: 5px;
        z-index: 20;
        font-size: 20px;
        display: flex;
        align-items: center;
        left: 0;
        right: 0;
        margin: auto;
    }

    .BottomBtn {
        font-size: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .captured-images {
        font-size: 20px;
        position: absolute;
        z-index: 20;
    }

}

.shutter {
    animation: shutter 0.3s linear 0s 1 normal forwards;
}

@keyframes shutter {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>
