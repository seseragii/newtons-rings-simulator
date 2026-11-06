const form = document.getElementById('input_data');
const canvas = document.getElementById('rings');
    function draw(){
        const detaaa = document.getElementById('data');
        const wavelength = parseFloat(document.getElementById('wavelength').value);
        const roc = parseFloat(document.getElementById('roc').value);
        const rindex = parseFloat(document.getElementById('rindex').value);
        const crosswiree = parseFloat(document.getElementById('crosswire').value);
        //dan bruton's algo to estimate rgb from wavelength. useful for l8r use
        let r,g,b;
        if(wavelength>=380 && wavelength<440){
            r = -(wavelength-440)/(440-380);
            g = 0;
            b = 1;
        }
        else if(wavelength>=440 && wavelength<490){
            r = 0;
            g = (wavelength-440)/(490-440);
            b = 1;
        }
        else if(wavelength>=490 && wavelength<510){
            r = 0;
            g = 1;
            b = -(wavelength-510)/(510-490);
        }
        else if(wavelength>=510 && wavelength<580){
            r = (wavelength-510)/(580-510);
            g = 1;
            b = 0;
        }
        else if(wavelength>=580 && wavelength<645){
            r = 1;
            g = -(wavelength-645)/(645-580);
            b = 0;
        }
        else if(wavelength>=645 && wavelength <=780){
            r = 1;
            g = 0;
            b = 0;
        }
        let f;
        if(wavelength>=380 && wavelength<420){
           f=0.3+0.7*((wavelength-380)/(420-380));
        }
        else if(wavelength>=420 && wavelength<701){
           f=1;
        }
        else if(wavelength>=701 && wavelength<=780){
           f=0.3+0.7*((-wavelength+780)/(780-701));
        }
        let gammacorrection = 0.8;
        r = Math.round(Math.pow(r*f, gammacorrection)*255);
        g = Math.round(Math.pow(g*f, gammacorrection)*255);
        b = Math.round(Math.pow(b*f, gammacorrection)*255);
        //algo ends
        let ringu = canvas.getContext("2d");
        ringu.clearRect(0, 0, canvas.width, canvas.height);
        let centerX = 350;
        let centerY = 350;
        let scalefactor = 330 / Math.sqrt((19.5 * 589 * 75 * 10**(-11)));
        let radii = 0;
        let maxradii = 330; 
        let n = 1; 
        while ((scalefactor * radii) < maxradii) {
            let decay = 1/Math.sqrt(n+1);
            ringu.strokeStyle = `rgba(${r}, ${g}, ${b}, ${decay})`;
            ringu.lineWidth = 15/Math.sqrt(n+1);
            ringu.shadowColor = `rgba(${r}, ${g}, ${b})`
            ringu.shadowBlur = 20;
            radii = Math.sqrt(((2*n -1) * wavelength * roc * 10**(-11)) / (2*rindex));
            ringu.beginPath();
            ringu.arc(centerX, centerY, scalefactor * radii, 0, 2 * Math.PI);
            ringu.stroke(); 
            n++;
        }
 ringu.shadowBlur = 0;
    let intensityL = Math.round(100*(Math.cos(((2*Math.PI*rindex*(crosswiree/10**3)*(crosswiree/10**3))/((wavelength/10**9)*(roc/100))+Math.PI)/2))*(Math.cos(((2*Math.PI*rindex*(crosswiree/10**3)*(crosswiree/10**3))/((wavelength/10**9)*(roc/100))+Math.PI)/2)));
    detaaa.innerHTML=`Distance from the centre bright: ${crosswiree} mm. <br> Local intensity: ${intensityL}%`;
    let pixelOffset = crosswiree*Math.pow(10, -3)*scalefactor;
    let activeCenterX = centerX + pixelOffset;
    const lineLength = 20; 
    ringu.lineWidth = 2;
    ringu.strokeStyle = 'white';
    ringu.beginPath();
    ringu.moveTo(activeCenterX, centerY - lineLength);
    ringu.lineTo(activeCenterX, centerY + lineLength);
    ringu.moveTo(activeCenterX - lineLength, centerY);
    ringu.lineTo(activeCenterX + lineLength, centerY);
    ringu.stroke();
    //graph
const int_graph = document.getElementById('intensity-graph');
const graph = int_graph.getContext('2d');
graph.clearRect(0, 0, 700, 200);

const midX = 350;
const midY = 180;

graph.line = (x1, y1, x2, y2) => { graph.beginPath(); graph.moveTo(x1, y1); graph.lineTo(x2, y2); graph.stroke(); };
graph.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`; 
graph.line(midX, 0, midX, 200); 
graph.line(0, midY, 700, midY);

graph.beginPath();
graph.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;

for (let x = 0; x < 700; x++) { 
    let r_mm = (x - midX) / scalefactor; 
    let y = midY - (100 * Math.cos(((2 * Math.PI * rindex * (r_mm ** 2)) / ((wavelength * 10 ** -9) * (roc / 100)) + Math.PI) / 2) ** 2) / Math.sqrt(Math.abs(r_mm) + 1);
    if (x == 0) {
        graph.moveTo(x, y);
    } else {
        graph.lineTo(x, y);
    }
}
graph.stroke();
    }
form.addEventListener('input', draw);
draw();