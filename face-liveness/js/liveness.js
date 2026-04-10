let model;

async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model Loaded");
}

loadModel();

async function captureFrame() {
    const canvas = document.createElement("canvas");
    canvas.width = 112;
    canvas.height = 112;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 112, 112);

    const imageTensor = tf.browser.fromPixels(canvas)
        .toFloat()
        .div(255.0)
        .expandDims(0);

    const prediction = model.predict(imageTensor);
    const score = prediction.dataSync()[0];

    const resultText = document.getElementById("resultText");
    const confidenceFill = document.getElementById("confidenceFill");

    confidenceFill.style.width = (score * 100) + "%";

    if(score > 0.7) {
        resultText.innerText = "Live Face Detected";
        resultText.className = "status live";
    } else {
        resultText.innerText = "Spoof Detected";
        resultText.className = "status spoof";
    }
}