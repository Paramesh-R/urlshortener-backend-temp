const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    try {

        const { error } = req.body;
        if (error) return res.status(4000).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: "User not found" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) res.status(401).send({ message: "Invalid Email or Password" })

        const token = user.generateAuthToken();

        res.status(200).send({ message: "Logged in successfully", data: token });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error - Auth", error });
    }
})

module.exports = router;
