document.addEventListener('DOMContentLoaded', () => {
    // Existing Elements
    const bgVideo = document.getElementById('bg-video');
    const audioBtn = document.getElementById('audio-btn');
    const ctaWatch = document.getElementById('cta-watch');
    const videoPlayerModal = document.getElementById('video-player-modal');
    const closeModal = document.getElementById('close-modal');
    const youtubePlayer = document.getElementById('youtube-player');
    const djAvatarContainer = document.querySelector('.dj-avatar-container');
    const voiceSample = document.getElementById('voice-sample');
    const audioVisualizer = document.getElementById('audio-visualizer');

    // New Web3 Elements
    const gatedItems = document.querySelectorAll('.gated-item');

    // --- Existing Logic ---

    // 1. Audio Toggle
    audioBtn.addEventListener('click', () => {
        if (bgVideo.muted) {
            bgVideo.muted = false;
            audioBtn.textContent = 'Mute';
        } else {
            bgVideo.muted = true;
            audioBtn.textContent = 'Unmute';
        }
    });

    // 2. Video Player Modal
    const videoId = 'dQw4w9WgXcQ'; // Placeholder YouTube ID
    ctaWatch.addEventListener('click', () => {
        videoPlayerModal.classList.remove('hidden');
        youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    });

    closeModal.addEventListener('click', () => {
        videoPlayerModal.classList.add('hidden');
        youtubePlayer.src = ''; // Stop the video
    });

    // 3. Play voice sample on click
    djAvatarContainer.addEventListener('click', () => {
        if (voiceSample.paused) {
            voiceSample.play();
        } else {
            voiceSample.pause();
            voiceSample.currentTime = 0;
        }
    });

    // 4. Parallax Effect for DJ Avatar
    const djAvatar = document.getElementById('dj-avatar');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 30;
        const y = (clientY / innerHeight - 0.5) * 30;
        djAvatar.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });

    // 5. Audio Visualizer Logic
    let audioContext, analyser, source, dataArray;

    function setupAudioVisualizer() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(bgVideo);
            source.connect(analyser);
analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
    }

    const canvas = audioVisualizer;
    const canvasCtx = canvas.getContext('2d');

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#0a0a0a';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2;
            
            const r = barHeight + (25 * (i/dataArray.length));
            const g = 250 * (i/dataArray.length);
            const b = 50;

            canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    document.body.addEventListener('click', () => {
        if (!audioContext) {
            setupAudioVisualizer();
            drawVisualizer();
        }
    }, { once: true });

});
</script>
