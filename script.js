const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const playPreviewButton = document.getElementById('playPreview');
const downloadRecordingButton = document.getElementById('downloadRecording');
const recordingVideoElement = document.getElementById('recording');

let mediaRecorder;
let recordedChunks = [];
let livePreviewStream;

startRecordingButton.addEventListener('click', async () => {
    livePreviewStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

    mediaRecorder = new MediaRecorder(livePreviewStream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Set the recorded content as the source after recording is finished
        recordingVideoElement.src = url;

        playPreviewButton.disabled = false;
        downloadRecordingButton.disabled = false;
    };

    mediaRecorder.start();

    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    livePreviewStream.getTracks().forEach(track => track.stop());

    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

playPreviewButton.addEventListener('click', () => {
    // Play the live preview stream
    recordingVideoElement.srcObject = livePreviewStream;
    recordingVideoElement.play();
});

downloadRecordingButton.addEventListener('click', () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen_recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
