const express = require('express')
const http = require('http')
const app = express()
const port = 3000


const {MongoClient} = require("mongodb");

const musuNr = ["2252", "2248", "5200", "2212", "5555", "2273"];

//Pvz Values
var ExampleNr = ["37060059378", "2252", "37068491587", "37064546131", "2248", "37061021628", "37067483531", "5200", "37065699056", "2212", "37062024911", "5555", "37067493336", "2273", "37060787327", "37067634711"];
var ExampleNr2 = ["2252", "37060059378", "2252", "2248",  "37064546131", "5200", "5200", "37061021628", "2212", "37067483531", "5555", "37065699056", "2273", "37062024911", "2273", "2273"];

var JSKiekSkambina = 0;
var JSKelintasSk = 0;
var JSArSkDarAktyvus = [];

var JSDabarKasKam = [];
var JSDabarKlVardas = [];
var JSDabarKlPavarde = [];
var JSDabarKlIrenginys = [];
var JSDabarKlRMANr = [];
var JSDabarKitasNr = [];
var JSDabarKasKam2 = [];
var JSDabarMusuNr = [];

var JSBuveLaikas = [];
var JSBuveKasKam = [];
var JSBuveKlVards = [];
var JSBuveKlPavarde = [];
var JSBuveKitasNr = [];
var JSBuveKasKam2 = [];
var JSBuveMusuNr = [];
var JSBuveArPakele = [];
var everythingData;


main1().catch(console.error);
async function main1() {
    const uri = /* Removed, the project is done, I'm no longer connecting to their data base */;
    const client = new MongoClient(uri);
    try{
        await client.connect();
        await getSkIstorija(client);
        await checker(client)
    } catch (e){
        console.error(e);
    } finally {
        // await client.close();
    }
}


async function checker(client){
    var rngCheckForCall = (Math.floor(Math.random() * 100))+1;
    if(rngCheckForCall>50 && JSKiekSkambina > 0){
        JSKiekSkambina -= 1;
        var paskutinisSk = JSArSkDarAktyvus.find(element => element > 0);
        JSArSkDarAktyvus[paskutinisSk] = 0;
    }
    if(rngCheckForCall<40){
        JSKiekSkambina += 1;
        JSKelintasSk += 1;
        JSArSkDarAktyvus[JSKelintasSk] = JSKelintasSk;
        
        var rngNumbers = Math.floor(Math.random() * 12);
        var skambinanciojoNr = ExampleNr[rngNumbers];
        var gaunanciojoNr = ExampleNr2[rngNumbers];
        getdabarSkInfo(client, skambinanciojoNr, gaunanciojoNr);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    checker(client);
}


async function getdabarSkInfo(client, skambinanciojoNr, gaunanciojoNr){
    if (musuNr.includes(skambinanciojoNr) == true){
        JSDabarKasKam[JSKelintasSk] = "Mes skambiname:";
        JSDabarKasKam2[JSKelintasSk] = "Iš mūsų nr: ";
        JSDabarMusuNr[JSKelintasSk] = skambinanciojoNr;
        JSDabarKitasNr[JSKelintasSk] = gaunanciojoNr;
        const SkNumeris = await client.db("crm").collection("clients").findOne({tel: gaunanciojoNr});
        if (SkNumeris){
            JSDabarKlVardas[JSKelintasSk] = `${SkNumeris.name}`;
            JSDabarKlPavarde[JSKelintasSk] = `${SkNumeris.surname}`;
            const SkDaiktas = await client.db("crm").collection("rma").findOne({"client.name": `${SkNumeris.name}`});
            if (SkDaiktas) {
                JSDabarKlIrenginys[JSKelintasSk] = `${SkDaiktas.brand}`;
                JSDabarKlRMANr[JSKelintasSk] = `${SkDaiktas.rma}`;
            }else{console.log("Daiktas Nerastas")}
        }else{
            JSDabarKlVardas[JSKelintasSk] = "Nepažystamas";
            JSDabarKlPavarde[JSKelintasSk] = "Nepažystamas";
            JSDabarKlIrenginys[JSKelintasSk] = "Nėra";
            JSDabarKlRMANr[JSKelintasSk] = "";
        }
    }else{
        JSDabarKasKam[JSKelintasSk] = "Mums skambina:";
        JSDabarKasKam2[JSKelintasSk] = "Į mūsų nr: ";
        JSDabarMusuNr[JSKelintasSk] = gaunanciojoNr;
        JSDabarKitasNr[JSKelintasSk] = skambinanciojoNr;
        const SkNumeris = await client.db("crm").collection("clients").findOne({tel: skambinanciojoNr});
        if (SkNumeris){
            JSDabarKlVardas[JSKelintasSk] = `${SkNumeris.name}`;
            JSDabarKlPavarde[JSKelintasSk] = `${SkNumeris.surname}`;
            const SkDaiktas = await client.db("crm").collection("rma").findOne({"client.name": `${SkNumeris.name}`});
            if (SkDaiktas) {
                JSDabarKlIrenginys[JSKelintasSk] = `${SkDaiktas.brand}`;
                JSDabarKlRMANr[JSKelintasSk] = `${SkDaiktas.rma}`;
            }else{console.log("Daiktas Nerastas")}
        }else{
            JSDabarKlVardas[JSKelintasSk] = "Nepažystamas";
            JSDabarKlPavarde[JSKelintasSk] = "Nepažystamas";
            JSDabarKlIrenginys[JSKelintasSk] = "Nėra";
            JSDabarKlRMANr[JSKelintasSk] = "";
        }
    }
}


async function getSkIstorija(client){
    const SkIstorija = await client.db("crm").collection("kalbu").find({redirect:{$exists:false}}).sort({start_time: -1}).limit(22);
    const SkAts = await SkIstorija.toArray();
    everythingData = SkAts
    if (SkIstorija) {
        for (i=0;i<22;i++){
            if (musuNr.includes(SkAts[i].caller_number) == true){
                JSBuveLaikas[i] = JSON.stringify(SkAts[i].start_time).slice(12, 17)+" Mes";
                JSBuveMusuNr[i] = `${SkAts[i].caller_number}`;
                JSBuveKitasNr[i] = `${SkAts[i].destination_number}`;
                JSBuveKasKam[i] = "skambinome:";
                JSBuveKasKam2[i] = "iš nr. ";
                const klientai = [];
                klientai[i] = await client.db("crm").collection("clients").findOne({tel: `${SkAts[i].destination_number}`});
                if(klientai[i] === null){
                    JSBuveKlVards[i] = "";
                    JSBuveKlPavarde[i] = "Nepažystamas";
                }else{
                    JSBuveKlVards[i] = JSON.stringify(klientai[i].name).slice(1, 2)+". ";
                    JSBuveKlPavarde[i] = klientai[i].surname;
                    }
            }else{
                JSBuveLaikas[i] = JSON.stringify(SkAts[i].start_time).slice(12, 17)+" Mums";
                JSBuveMusuNr[i] = `${SkAts[i].destination_number}`;
                JSBuveKitasNr[i] = `${SkAts[i].caller_number}`;
                JSBuveKasKam[i] = "skambino:";
                JSBuveKasKam2[i] = "į nr.";
                const klientai = [];
                klientai[i] = await client.db("crm").collection("clients").findOne({tel: `${SkAts[i].caller_number}`});
                if(klientai[i] === null){
                    JSBuveKlVards[i] = "";
                    JSBuveKlPavarde[i] = "Nepažystamas";
                }else{
                    JSBuveKlVards[i] = JSON.stringify(klientai[i].name).slice(1, 2)+". ";
                    JSBuveKlPavarde[i] = klientai[i].surname;
                }
            }
        }
    } else {
        console.log(`Niekas nerasta`);
    }
}


app.use('/SkStatics', express.static('SkStatics'));

app.use('/data', (req, res) => {
    res.json(everythingData);
});

app.use('/dataNice', (req, res) => {
    res.json({JSBuveLaikas, JSBuveKasKam, JSBuveKitasNr, JSBuveKasKam2, JSBuveMusuNr, JSBuveKlVards, JSBuveKlPavarde, 
        JSDabarKasKam, JSDabarKlVardas, JSDabarKlPavarde, JSDabarKitasNr, JSDabarKlIrenginys, JSDabarKlRMANr, JSDabarKasKam2, JSDabarMusuNr,
        JSKiekSkambina, JSKelintasSk, JSArSkDarAktyvus});
});

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/Skambuciu Duomenu Vaizdas2.html');
})

app.get('/SkInformacija', (req, res) => {
    res.sendFile(__dirname +'/Skambuciu Duomenu Vaizdas2.html');
})

app.get('/SkIstorija', (req, res) => {
    res.sendFile(__dirname +'/SkDB Istorijos Atvaizdavimas.html');
})

app.listen(port, () => {
    console.log(`Serveris paleistas.:http://localhost:${port}`);
})