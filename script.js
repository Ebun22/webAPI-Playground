let stream;
var blue = "btn-primary";
var grey = "btn-secondary";
var green = "btn-success";
let videoTag = document.querySelector('#my-video');
let blob = [];
let mediaRecorder;
let superBlob
let videoUrl;
let mediaStream;
let divEl =  document.querySelector('#cont-other-feed');
let downloadEl = document.createElement('a');

const getMicAndCamera = async () => {
    const constraints = {
        video: {width: 1200, height: 500},
        audio: true
    };
    try{
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        const tracks = stream.getTracks();
    }catch(err){
        console.log("there was an error geting media devices" + err)
    }
    
    colorChange([green, blue, grey, grey, grey, grey, grey, grey])
}

const startVideo = () => {
    if(!stream) return;
    videoTag.srcObject = stream;
    colorChange([green, green, blue, blue, blue, grey, grey, blue])
}

const stopVideo = () => {
    if(!stream) return;
    const track = stream.getTracks()
    track.forEach( track => {
        track.stop()
    });
    console.log('streaming stopped')
    colorChange([blue, grey, green, grey, grey, grey, grey, grey])
}

const changeDeviceSize = async () => {
    if(!stream) return;
    const videoTracks = stream.getVideoTracks();
    let vwidth = document.querySelector('#vid-width').value;
    let vheight = document.querySelector('#vid-height').value;

    videoTracks.forEach(async videoTrack => {
        const capability = videoTrack.getCapabilities()
        const newConstraints = {
            height: {exact: vheight < capability.height.max ? vheight: capability.height.max},
            width: {exact: vwidth < capability.width.max ? vwidth : capability.width.max},
        };
        try {
            await videoTrack.applyConstraints(newConstraints);
            console.log("Constraints applied successfully for video track");
            console.log(videoTrack.getConstraints()); // Log the applied constraints
        } catch (error) {
            console.error("Error applying constraints to video track:", error);
        }
    });

    colorChange([green, green, blue, green, blue, grey, grey, blue])
};

const startRecording = () => {
    if(!stream) return;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
        console.log("data is available");
        blob.push(event.data)
    }
    console.log("recording started");
    mediaRecorder.start();
    colorChange([green, green, blue, blue, green, blue, grey, blue])
}

const stopRecording = () => {
    if(!mediaRecorder) return;
    console.log("Recording has stopped");
    mediaRecorder.stop();
    setTimeout(() => {
        divEl.removeChild(downloadEl)
    }, 200)
    colorChange([green, green, blue, blue, blue, green, blue, blue])
}

const playRecording = () => {
    if(!blob) return;
    console.log("Recording played");
    superBlob = new Blob(blob, {
        type: "video/webm"
    });
    videoUrl = window.URL.createObjectURL(superBlob);
    const recorderVid = document.querySelector('#other-video');
    console.log(recorderVid)
    recorderVid.src = videoUrl;
    recorderVid.controls = true;
    recorderVid.play();
    save()
    colorChange([green, green, blue, blue, blue, grey, green, blue])
}

const save = () => {
    downloadEl.style.display = 'block'; // Make the anchor tag visible
    downloadEl.style.color = 'blue';
    downloadEl.textContent = 'Download';
    downloadEl.href = videoUrl;
    divEl.appendChild(downloadEl);

    downloadEl.addEventListener('click', () => {
        const clipName = prompt("Enter name of video");
        downloadEl.download = `${clipName}.webm`;
        console.log("video has been downloaded");
    });
}

const shareScreen = async () => {
    console.log("share screen is working");
    const options = {
        video: true,
        audio: false,
        surfaceSwitching: 'include'
    }
    try{
        mediaStream = await navigator.mediaDevices.getDisplayMedia(options)
    }catch(err){
        console.log("The promise was rejected: ", err)
    }
    colorChange([green, green, blue, blue, blue, grey, grey, green])
};

const colorChange = (color) => {
    const buttons = ["share","show-video", "stop-video","change-size", "start-record","stop-record","play-record","share-screen"]
    for(var i = 0; i < buttons.length; i++){
        document.querySelector(`#${buttons[i]}`).classList.remove("btn-primary")
        document.querySelector(`#${buttons[i]}`).classList.remove("btn-secondary")
        document.querySelector(`#${buttons[i]}`).classList.remove("btn-success")
        document.querySelector(`#${buttons[i]}`).classList.add(color[i])
    }   
}

document.querySelector('#share').addEventListener('click', getMicAndCamera)
document.querySelector('#show-video').addEventListener('click', startVideo);
document.querySelector('#stop-video').addEventListener('click', stopVideo);
document.querySelector('#start-record').addEventListener('click', startRecording);
document.querySelector('#stop-record').addEventListener('click', stopRecording);
document.querySelector('#play-record').addEventListener('click', playRecording);
document.querySelector('#share-screen').addEventListener('click', shareScreen);
document.querySelector('#change-size').addEventListener('click', changeDeviceSize);
