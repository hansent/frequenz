
module.exports = function(url, callback){

    var context = new webkitAudioContext();
    var source;
    var analyser;
    var url = 'assets/music.ogg';
    var array = new Array();
    var boost = 0;

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        context.decodeAudioData(
            request.response,
            function(buffer) {
                if(!buffer) {
                    console.error('Error decoding file data');
                    return;
                }

                sourceJs = context.createScriptProcessor(2048, 1, 1);
                sourceJs.buffer = buffer;
                sourceJs.connect(context.destination);

                analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.6;
                analyser.fftSize = 256;

                source = context.createBufferSource();
                source.buffer = buffer;
                source.loop = true;


                sourceJs.onaudioprocess = function(e) {
                    callback(e, analyser);
                };


                source.connect(analyser);
                analyser.connect(sourceJs);
                source.connect(context.destination);

                setTimeout(function() {
                    source.start(0);
                }, 0);


            },
            function(error) {
                console.error('Decoding error:' + error);
            }
            );
};

request.onerror = function() {
    console.error('buffer: XHR error');
};



request.send();

}
