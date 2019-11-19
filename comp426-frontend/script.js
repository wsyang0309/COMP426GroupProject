import apicalypse from 'apicalypse';



 let test = async function() {// async/await
    const rawQueryString = 'fields a,b,c;limit 50;offset 0;';
try {
    const response = await apicalypse(rawQueryString)
        .request('https://myapi.com/actors/nm0000216');

    // This is an axios response: https://github.com/axios/axios#response-schema
    console.log(response.data); 
} catch (err) {
    console.error(err);
}
 }

 test();