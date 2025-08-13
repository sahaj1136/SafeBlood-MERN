const router = require("express").Router();
const auth = require("../middleware/auth");
const { User, Donations, Requests, BloodBank } = require("../models/models");

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.find({ _id: req.user });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/donate", auth, async (req, res) => {
    try {
        req.body.userId = req.user;
        const date = new Date();
        req.body.date = date.toLocaleTimeString() + " " + date.toLocaleDateString();
        const newDonation = new Donations(req.body);
        const saved = await newDonation.save();
        await BloodBank.update(
            { _id: req.body.bankId },
            { $push: { donations: { _id: saved._id } } }
        );
        res.send("done")
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/request", auth, async (req, res) => {
    try {
        req.body.userId = req.user;
        const date = new Date();
        req.body.date = date.toLocaleTimeString() + " " + date.toLocaleDateString();
        const newRequest = new Requests(req.body);
        const saved = await newRequest.save();
        await BloodBank.update(
            { _id: req.body.bankId },
            { $push: { requests: { _id: saved._id } } }
        );
        res.send("done")
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

router.get("/donations", auth, async (req, res) => {
    try {
        const data = await Donations.find({ userId: req.user }).populate('bankId', '-_id -__v -password -requests -donations -stock');
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/requests", auth, async (req, res) => {
    try {
        const data = await Requests.find({ userId: req.user }).populate('bankId', '-_id -__v -password -requests -donations -stock');
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/", auth, async (req, res) => {
    try {
        console.log(req.user);
        User.updateOne({ _id: req.user }, req.body, (err, user) => {
            if (err) {
                res.send(404, "User not found");
            } else {
                res.send(200, "User updated");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/rewards", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user, "name rewardPoints");
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put('/reward', async (req, res) => {
    try {
        const { userId, points } = req.body;
        const donations = await Donations.findById(userId);
        const user = await User.findById(donations.userId);
        if (!user) return res.status(404).json({ message: `User not found ${donations.userId}` });

        user.rewardPoints = user.rewardPoints + points;
        await user.save();

        res.json({ message: "Reward updated", rewardPoints: user.rewardPoints });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
