export default async (req, res) => {
    try {
        const response = await fetch('https://your-infinityfree-backend-url.com' + req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
