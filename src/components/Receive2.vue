<template>
    <div :class="[submitSuccess?'bg-green-500':'bg-black']" class="w-full h-full flex flex-col justify-end items-center font-lexend duration-1000 delay-500">

        <div class="fixed top-0 left-0 w-full p-6 pointer-events-none flex justify-end items-center">

            <!-- <button @click="handleCancel" class="bg-white text-black py-2 px-4 rounded-full pointer-events-auto">Cancel</button> -->

            <button @click="handleEdit" class="underline font-bold py-2 px-4 pointer-events-auto text-white">Edit</button>
            
        </div>


        <!-- <div class="w-[70vw] h-[70vw] bg-white rounded-2xl shadow-2xl relative flex justify-center items-center">

            <p class="text-lg absolute top-4 animate-pulse">Looking for a Face</p>

        </div>


        <div class="p-8 text-2xl space-y-4 text-center">
            <p class="">please pay @username</p>
            <p>1234 USDC</p>
        </div> -->

        <div :class="[isEditMode?'h-[50vh] flex flex-col justify-center items-center':'']" class="text-center space-y-8 text-white">
            <div class="flex justify-center items-center">
                <p v-if="!submitSuccess" class="text-3xl">pay </p>
                <p v-else class="text-3xl">paid</p>
                <div class="ml-2 bg-white text-black py-2 px-4 rounded-full text-xl ">@{{ recipientUsername }}</div>
            </div>
            <p v-if="!isEditMode" class="text-6xl font-bold">{{ amount }} USDC</p>
            <div v-if="isEditMode" class="text-5xl font-bold break-all flex justify-center items-center flex-wrap font-doto">
                <p v-if="amount">{{ amount }}</p>
                <p v-else class="text-white/20 whitespace-nowrap p-4 text-4xl">Enter amount</p>
                <p class="ml-2 text-4xl text-white/50">Base USDC</p>
            </div>
            
            <!-- <p class="text-2xl">to @username</p> -->
        </div>

        <div v-if="isEditMode" class="h-[50vh] grid grid-rows-[1fr_auto] w-full">
            <div class="w-full h-full p-4">
                <div class="w-full h-full grid grid-cols-3 grid-rows-4 gap-2">
                    <button 
                        v-for="key in keypadKeys" 
                        :key="key"
                        @click="handleKeyPress(key)"
                        class="bg-white/10 text-white hover:bg-gray-200 active:bg-gray-300 rounded-xl flex items-center justify-center text-3xl font-bold transition-colors duration-100 font-doto"
                    >
                        {{ key }}
                    </button>
                </div>
            </div>

            <div class="p-4 w-full pb-8">
                <button 
                    @click="handleConfirm"
                    class="bg-white text-black rounded-xl p-4 w-full text-lg hover:bg-white/90 active:bg-white/80 transition-colors"
                >
                    Confirm
                </button>
            </div>
        </div>


        <div v-if="!isEditMode" :class="[
            
            submitSuccess?'h-[50vh]':(
                accountFound?['h-[70vh]', isVerified?'pb-[5vh]':'pb-[20vh]']:'h-[60vh] pb-24'
            ),]" class="flex justify-end items-center flex-col duration-300">


            <template v-if="!submitSuccess">

                <div :class="[isIdentifyingFace?'w-[18vh] h-[18vh]':'w-[15vh] h-[15vh]']" class=" bg-gray-200 rounded-full mb-8 duration-300 overflow-hidden">
                    <video 
                        ref="videoRef" 
                        autoplay 
                        muted 
                        playsinline 
                        :class="[
                            'h-full w-full object-cover transition-transform duration-300',
                            { 'scale-x-[-1]': isFlipped }
                        ]"
                    >
                    </video>
                </div>
    
                <div v-if="isDetectingFace" class="flex flex-col items-center gap-2">
                    <Eyecon />
                    <p class="animate-pulse text-gray-400">Looking for a Face</p>
                </div>
    
                <div v-if="isIdentifyingFace" class="flex flex-col items-center gap-2">
                    <p class="animate-pulse text-gray-400">Searching Account</p>
                </div>


            </template>

            <template v-if="!submitSuccess">

                <div v-if="accountFound && !isVerified" class="flex flex-col items-center gap-2">
                    <button :disabled="submitBusy" @click="clickDialog()" class="pointer-events-auto bg-white text-black py-2 px-4 pr-2 rounded-xl flex items-center gap-2 disabled:opacity-50 hover:bg-white/90 active:bg-white/80 transition-colors">
                        <p>Sign with Pattern</p>
                        <iconify-icon class="text-4xl" icon="mage:dots-menu" />
                    </button>
                </div>

                <div v-if="accountFound && isVerified" class="flex flex-col items-center gap-4">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-white">Hello <span class="font-doto text-3xl ml-2">@{{ payerUsername }}</span></p>
                        <p class="text-red-500">Sign again to confirm payment</p>
                    </div>

                    <button :disabled="submitBusy" @click="showPatternDialog = true" class="bg-white text-black p-4 px-8 text-lg rounded-xl flex items-center justify-center disabled:opacity-50 w-[80vw] h-14">
                        <template v-if="!submitBusy">
                            <span class="mr-4">Pay {{ amount }} USDC</span>
                            <iconify-icon class="text-4xl" icon="mage:dots-menu" />
                        </template>
                        <template v-else>
                            <span class="mr-4">Signing...</span>
                            <iconify-icon class="text-4xl animate-[spin_3s_linear_infinite]" icon="mage:dots-menu" />
                        </template>
                    </button>

                    <button v-if="!submitBusy" @click="handleSignOutAndCancel" class="border-2 border-white text-white p-4 px-8 text-lg rounded-xl flex items-center justify-center w-[80vw] h-14">Cancel & Sign Out</button>
                </div>
                
            </template>
            <template v-if="submitSuccess">
                <div class="flex flex-col justify-center items-center gap-2 h-full">
                    <iconify-icon class="text-6xl text-black" icon="fluent:checkmark-12-filled" />
                    <p class="text-2xl">Paid</p>
                </div>
            </template>

        </div>

        <div v-if="submitSuccess" class="w-full p-4">
            <button @click="done" class="bg-white text-black rounded-xl p-4 text-lg hover:bg-white/10 active:bg-white/20 transition-colors w-full">
                <p>Done</p>
            </button>
        </div>

        <Teleport to="body">
            <PatternSignDialog 
                :is-open="showPatternDialog"
                @close="showPatternDialog = false"
                @pattern-complete="handlePatternComplete"
            />
        </Teleport>
        
    </div>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import Eyecon from './Eyecon.vue';
import PatternSignDialog from './PatternSignDialog.vue';
import { parseUnits } from 'viem';
import { generateProof, getUsernameHash, refreshBalance, username } from '../stores/user'

import { Human } from '@vladmandic/human'
// Initialize Human with proper configuration
const human = new Human({
    backend: 'webgl',
    modelBasePath: '/models',
    face: {
        enabled: true,
        detector: {
            enabled: true,
            rotation: true,
            return: true,
            maxDetected: 1,
            minConfidence: 0.5
        },
        mesh: { enabled: true },
        embedding: {
            enabled: true,
            return: true
        },
        description: { enabled: true },
        emotion: { enabled: false },
        iris: { enabled: false },
        antispoof: { enabled: false },
        liveness: { enabled: false }
    },
    // Disable other features for better performance
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false }
})
const FACE_SIZE_THRESHOLD = 0.5 // Face should take up at least 30% of the video width

onMounted(() => {
    recipientUsername.value = username.value;
})

const isEditMode = ref(true);
const amount = ref('');
const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];

const isDetectingFace = ref(false);
const isIdentifyingFace = ref(false);
const accountFound = ref(false);
const showPatternDialog = ref(false);
const isVerified = ref(false);
const submitBusy = ref(false);

const submitSuccess = ref(false);

const recipientUsername = ref(null);
const captureInfo = ref('');
const isFlipped = ref(true);
const videoRef = ref(null);
const isFaceDetected = ref(false);
let detectInterval = null;

const payerEmbedding = ref(null);
const payerUsername = ref(null);
const payerPattern = ref(null);

const emit = defineEmits(['close']);

const handleKeyPress = (key) => {
    if (key === '←') {
        amount.value = amount.value.slice(0, -1);
    } else if (key === '.') {
        if (!amount.value.includes('.')) {
            amount.value += '.';
        }
    } else {
        amount.value += key;
    }
};

const handleConfirm = async () => {
    if (!amount.value) return;
    console.log('Confirmed amount:', amount.value);
    isEditMode.value = false;


    isDetectingFace.value = true;

    captureInfo.value = 'Requesting camera...'
    const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
            facingMode: 'user'
        },
        audio: false
    });
    videoRef.value.srcObject = stream;
    
    await new Promise(resolve => {
        videoRef.value.onloadedmetadata = resolve;
    });
    await videoRef.value.play();
    await checkFaceDetection();
    await searchAccount();

    // setTimeout(() => {
    //     isDetectingFace.value = false;
    //     isIdentifyingFace.value = true;
    //     setTimeout(() => {
    //         isIdentifyingFace.value = false;
    //         accountFound.value = true;
    //     }, 2000);
    // }, 2000);
};

const checkFaceDetection = async () => {
    if (!videoRef.value) return;

    captureInfo.value = 'Initializing face detection...'
    // Initialize Human models
    try {
        await human.load();
        await human.warmup();
    } catch (error) {
        console.error('Error initializing face detection:', error);
        return;
    }

    detectInterval = setInterval(async () => {
        if (videoRef.value.paused || videoRef.value.ended) return;
        
        try {
            const result = await human.detect(videoRef.value);
            // Update face detection status
            isFaceDetected.value = result.face && result.face.length > 0;
            isDetectingFace.value = !(result.face && result.face.length > 0);
            // console.log(faceDetected.value);
            
        } catch (error) {
            console.error('Error in face detection:', error);
        }
    }, 100);
};

const searchAccount = async () => {
    captureInfo.value = 'Searching for account...'
    isIdentifyingFace.value = true;

    try {
        const vresult = await human.detect(videoRef.value, {
            face: {
                detector: { enabled: true, rotation: true },
                mesh: { enabled: true },
                embedding: { enabled: true }
            }
        })

        if (!vresult.face || vresult.face.length === 0) {
            throw new Error('No face detected')
        }
        console.log('Face detected, searching in database...', vresult);

        const matchedData = await searchPinecone(vresult.face[0].embedding);
        console.log('Matched data:', matchedData);

        if(!matchedData) {
            captureInfo.value = 'No account found, please try again'
            isIdentifyingFace.value = true;
            await searchAccount()
        } else {
            payerEmbedding.value = matchedData;
            captureInfo.value = 'Account found, please authenticate with your pattern'
            isIdentifyingFace.value = false;
            accountFound.value = true;
        }
    } catch (error) {
        console.error('Error searching account:', error);
        captureInfo.value = 'Error searching account:' + error
    }

}


const searchPinecone = async (_faceEmbedding) => {
    // Search in Pinecone
    const response = await fetch('https://face4-ff60525.svc.aped-4627-b74a.pinecone.io/query', {
        method: 'POST',
        headers: {
            'Api-Key': 'pcsk_65jcaw_DxQsFPjgiuo5pTiYBsovpdYo7DsPALMLM5bKMzCxLgnm5rrWh8NxibVMDrCC8qG',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vector: Array.from(_faceEmbedding),
            topK: 5,
            includeMetadata: true
        })
    })

    if (!response.ok) throw new Error('Failed to search database')

    const data = await response.json()
    console.log('Pinecone response:', data)
    return data.matches[0].score > 0.7 ? data.matches[0] : null;
}



// Add these helper functions at the top of your script section
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Helper function to convert string to base64
function stringToBase64(str) {
    return btoa(str);
}

// Helper function to convert base64 to string
function base64ToString(base64) {
    return atob(base64);
}

// Function to get encryption key from password
async function getEncryptionKey(password) {
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('your-secure-salt'),  // Use a secure salt
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Decryption function
async function decryptMetadata(encryptedData, pin) {
    try {
        const encryptionKey = pin;
        const key = await getEncryptionKey(encryptionKey);

        // Convert base64 to Uint8Array
        const encryptedArray = new Uint8Array(
            base64ToString(encryptedData).split('').map(c => c.charCodeAt(0))
        );

        // Extract IV and encrypted content
        const iv = encryptedArray.slice(0, 12);
        const content = encryptedArray.slice(12);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            content
        );

        return JSON.parse(decoder.decode(decryptedData));
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
        // throw error;
    }
}


const firstPin = ref(null);

const handlePatternComplete = async (pattern) => {

    if(!isVerified.value){

        const decryptedUsername = await decryptMetadata(payerEmbedding.value.metadata.username, pattern)
        console.log('decryptedUsername:', decryptedUsername);

        if(decryptedUsername) {
            payerUsername.value = decryptedUsername
            payerPattern.value = pattern
            clearInterval(detectInterval)
            isVerified.value = true;
            firstPin.value = pattern;
        } else {
            alert('Verification failed');
        }
    }else{

        if(firstPin.value !== pattern) {
            alert('Verification pattern mismatch')
            return;
        } 
        
        console.log('Pattern completed:', pattern);
        // Handle the pattern completion here
        submitBusy.value = true;

        const decryptedUsername = await decryptMetadata(payerEmbedding.value.metadata.username, pattern)
        console.log('decryptedUsername:', decryptedUsername);

        if(decryptedUsername) {
            payerUsername.value = decryptedUsername
            payerPattern.value = pattern
            clearInterval(detectInterval)
            
            const paymentSuccess = await handlePay()
            if(paymentSuccess){
                submitSuccess.value = true;

                setTimeout(() => {
                    document.getElementById(`close-receive`).click();
                    resetReceive();
                }, 5000);

            }else{
                submitSuccess.value = false;
            }
        } else {
            submitSuccess.value = false;
            handleSignOutAndCancel();
            alert('Incorrect pattern')
            return;
        }  

        submitBusy.value = false;
    
        // setTimeout(() => {
        //     submitSuccess.value = true;
        //     submitBusy.value = false;
        // }, 2000);
    }
    
};



const handlePay = async () => {
    console.log('pay')
    const proof = await generateProof(payerUsername.value, payerPattern.value)
    console.log('proof:', proof)
    try {
        const response = await fetch('/api/pay', {
            method: 'POST',
            body: JSON.stringify({
                "proof": proof,
                "amount": parseUnits(String(amount.value), 6).toString(),
                "to_hash": await getUsernameHash(recipientUsername.value),
            })
        })
        if (!response.ok) {
            alert('Payment failed. Please try again.');
            return false;
        } else {
            const data = await response.json()
            refreshBalance.set(Date.now());
            console.log('Payment response:', data)
            return true;
        }
    } catch (error) {
        console.log('Error paying:', error)
        alert('Payment failed. Please try again.');
        return false;
    }
}


const handleCancel = () => {
    window.location.href = '/app';
}

const handleEdit = () => {
    isEditMode.value = true;
    
    // reset all other flags
    isDetectingFace.value = false;
    isIdentifyingFace.value = false;
    accountFound.value = false;
    submitSuccess.value = false;
}

const handleClose = () => {
    console.log('handleClose called');
    closeReceive();
    emit('close');
}

const handleSignOutAndCancel = () => {
    console.log('handleSignOutAndCancel called');
    closeReceive();
    document.getElementById(`close-receive`).click();
}

const clickDialog = () => {
    console.log('clickDialog')
    showPatternDialog.value = true;
}

const done = (event) => {
    console.log('done called');
    if (detectInterval) {
        clearInterval(detectInterval);
    }
    closeReceive();
    document.getElementById(`close-receive`).click();
}

const closeReceive = () => {
    console.log('closeReceive called');
    // Stop all video tracks from the stream
    if (videoRef.value && videoRef.value.srcObject) {
        console.log('Found videoRef and srcObject, stopping tracks...');
        const tracks = videoRef.value.srcObject.getTracks();
        console.log('Found tracks:', tracks.length);
        tracks.forEach(track => {
            console.log('Stopping track:', track.kind, track.label);
            track.stop();
        });
        videoRef.value.srcObject = null;
        console.log('Video tracks stopped and srcObject cleared');
    } else {
        console.log('No videoRef or srcObject found to clean up');
    }
    clearInterval(detectInterval);
}

const resetReceive = () => {
    console.log('resetReceive called');
    closeReceive();

    isVerified.value = false;
    accountFound.value = false;
    isDetectingFace.value = true
    isEditMode.value = true
    videoRef.value = null;
    clearInterval(detectInterval)
    amount.value = ''
    showPatternDialog.value = false
    submitSuccess.value = false
    submitBusy.value = false
    payerUsername.value = null
    payerPattern.value = null
    payerEmbedding.value = null
}

onBeforeUnmount(() => {
    console.log('onBeforeUnmount called');
    resetReceive();
})

onUnmounted(() => {
    console.log('onUnmounted called');
    resetReceive();
})

// Expose closeReceive to parent
defineExpose({
    closeReceive,
    resetReceive
});

</script>

<style>
.font-lexend {
    font-family: "Lexend", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings: "wdth" 100;
}

.font-doto {
    font-family: "Doto", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings: "wdth" 100;
}
</style>

