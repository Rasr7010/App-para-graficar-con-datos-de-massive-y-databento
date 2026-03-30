exports.handler = async function(event, context) {
    // 1. Recibimos los datos que nos manda tu archivo HTML
    const { ticker, start, end, schema, dataset, apiKey } = event.queryStringParameters;

    if (!apiKey) {
        return { statusCode: 400, body: "Falta la API Key" };
    }

    // 2. Armamos la URL real de Databento
    const url = `https://hist.databento.com/v0/timeseries.get_range?dataset=${dataset}&symbols=${ticker}&schema=${schema}&start=${start}&end=${end}T23:59:59&encoding=json`;

    try {
        // 3. Encriptamos la clave y hacemos la petición de servidor a servidor (Sin CORS)
        const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');
        
        const response = await fetch(url, {
            headers: { 'Authorization': authHeader }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { statusCode: response.status, body: errorText };
        }

        const data = await response.text();

        // 4. Le devolvemos los datos limpios a tu gráfico
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Le decimos al navegador que todo está bien
                "Content-Type": "text/plain"
            },
            body: data
        };

    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};