const getHomeMessage = (req, res) => {
    res.send('Server is running from modular setup!');
};

module.exports = {
    getHomeMessage
};
