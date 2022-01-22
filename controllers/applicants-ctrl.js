const mongoose = require("mongoose");
const UserApplied = require("../models/applicants");
const UserProfile = require("../models/userProfile");
const { sendMail } = require("../utils/node-mailer");

function splitToChunks(array, parts) {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// For User
module.exports.createApplicant = async (req, res) => {
  const new_applicant = new UserApplied({
    ...req.body,
    isAccepted: 0,
  });
  try {
    const checkUser = await UserApplied.findOne({ email: new_applicant.email });
    if (checkUser) {
      return res.status(400).json({
        message: "You have already applied for this Society",
      });
    }
    new_applicant.save().then(() => {
      const mailRes = sendMail({
        from: "faangpledgemailer@gmail.com",
        to: new_applicant.email,
        subject: "Confirmation of Registration",
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@1,200&display=swap");
        
              * {
                margin: 0;
                padding: 0;
                border: 0;
              }
        
              body {
                font-family: "Raleway", sans-serif;
                background-color: #d8dada;
                font-size: 19px;
                max-width: 800px;
                margin: 0 auto;
                padding: 3%;
              }
        
              img {
                max-width: 100%;
              }
        
              header {
                width: 98%;
              }
        
              #logo {
                max-width: 100px;
                margin: 3% 0 3% 3%;
                float: left;
              }
              #logo > img {
                max-width: 80%;
              }
              #wrapper {
                background-color: #f0f6fb;
              }
        
              #social {
                float: right;
                margin: 3% 2% 4% 3%;
                list-style-type: none;
              }
        
              #social > li {
                display: inline;
              }
        
              #social > li > a > img {
                max-width: 35px;
              }
        
              h1,
              p {
                margin: 3%;
              }
              .btn {
                float: right;
                margin: 0 2% 4% 0;
                background-color: #303840;
                color: #f6faff;
                text-decoration: none;
                font-weight: 800;
                padding: 8px 12px;
                border-radius: 8px;
                letter-spacing: 2px;
              }
        
              hr {
                height: 1px;
                background-color: #303840;
                clear: both;
                width: 96%;
                margin: auto;
              }
        
              #contact {
                text-align: left;
                padding-bottom: 3%;
                line-height: 16px;
                font-size: 12px;
                color: #303840;
              }
            </style>
          </head>
          <body>
            <div id="wrapper">
              <header>
                <div id="logo">
                  <img
                    src="https://res.cloudinary.com/dcoderdtu/image/upload/v1642826937/D_CODER_LOGO_color_1_lzxspa.png"
                    alt=""
                  />
                </div>
                <div>
                  <ul id="social">
                    <li>
                      <a
                        href="https://www.linkedin.com/company/dcoder/mycompany/"
                        target="_blank"
                        ><img
                          src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                          alt=""
                      /></a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/d_coder_dtu/" target="_blank"
                        ><img
                          src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                          alt=""
                      /></a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCz0Bs3AXaa5ccEJBsLxyXzg"
                        target="_blank"
                        ><img
                          src="https://cdn-icons-png.flaticon.com/512/174/174883.png"
                          alt=""
                      /></a>
                    </li>
                  </ul>
                </div>
              </header>
              <div id="banner">
                <img src="./eafd64f6-6f8f-46a9-9aae-295b64155e7a.jpg" alt="" />
              </div>
              <div class="one-col">
                <h1>Dear ${new_applicant.name},<br /></h1>
        
                <p>Thank you for registering for D_CODER Recruitments.</p>
        
                <p>
                  D_CODER is not just a society, we are a family in which we build
                  connections, create innovations, and progress towards success. We
                  support each other to learn, grow and work to achieve everything that
                  one aspires to. .
                </p>
                <p>
                  See What We Do, what Our Achievements are, and Our Projects that
                  students just like you have built with their skills and guidance that
                  they have gained from our society. And don’t forget to view Our
                  Events, we are sure you also wanna be a part of them, and explore your
                  creativity and event management skills. We have a variety of people
                  that are ready to mentor you or be a part of your project, be it any
                  field, say Web Development, Android Development, UI/UX and Graphic
                  Design, Video Editing, Competitive Programming, Data Structures and
                  Algorithms, and many more.
                </p>
                <p>
                  If you have any questions or concerns, feel free to drop us an email
                  at contact@teamdcoder.com.
                </p>
        
                <hr />
        
                <footer>
                  <p id="contact">
                    Thanks,
                    <br />
                    Team D_CODER <br />
                  </p>
                </footer>
              </div>
            </div>
          </body>
        </html>
        `,
      });
      res.status(201).json(new_applicant);
    });
  } catch (error) {
    res.status(400).json("Unable to save the details of the user");
  }
};

// For Admin

module.exports.assignApplicantsToRecruiters = async (req, res) => {
  try {
    //payload: [{idRecruiter: id, idApplicants:[idApplied1, idApplied2, idApplied3...]}, {...},...]
    let reqs = req.body.payload;
    console.log("REQS!", reqs);
    reqs.forEach(async (entry) => {
      const interviewer = await UserProfile.findOne({ _id: entry.idRecruiter });
      await UserApplied.updateMany(
        {
          _id: { $in: entry.idApplicants },
        },
        {
          idRecruiter: mongoose.Types.ObjectId(entry.idRecruiter),
          interviewerName: interviewer.firstName + " " + interviewer.lastName,
        }
      );
    });
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports.assignApplicantsToRecruitersBulk = async (req, res) => {
  try {
    //idRecruiters: ['...','...',...], idApplicants: ['...','...',...]
    let { idRecruiters, idApplicants } = req.body;
    idRecruiters = shuffle(idRecruiters);
    idApplicants = shuffle(idApplicants);
    idApplicants = splitToChunks(idApplicants, idRecruiters.length);
    let reqs = idRecruiters.map((id, index) => {
      return {
        idRecruiter: id,
        idApplicants: idApplicants[index],
      };
    });
    reqs.forEach(async (entry) => {
      const interviewer = await UserProfile.findOne({ _id: entry.idRecruiter });
      await UserApplied.updateMany(
        {
          _id: { $in: entry.idApplicants },
        },
        {
          idRecruiter: mongoose.Types.ObjectId(entry.idRecruiter),
          interviewerName: interviewer.firstName + " " + interviewer.lastName,
        }
      );
    });
    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.log("ERROR!:", error);
    res.status(400).json({ error: error });
  }
};

module.exports.getApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getRecruiterApplicants = async (req, res) => {
  const { userId } = req.body;
  try {
    const applicants = await UserApplied.find({ idRecruiter: userId });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getAwaitingApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({
      interviewCompleted: true,
      isAccepted: 0,
    });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getAcceptedApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({ isAccepted: 1 });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.getRejectedApplicants = async (req, res) => {
  try {
    const applicants = await UserApplied.find({
      isAccepted: -1,
    });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports.acceptApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        isAccepted: 1,
      }
    );

    const mailRes = sendMail({
      from: "faangpledgemailer@gmail.com",
      to: update_applicant.email,
      subject: "Accepted to D_Coder",
      text: "Welcome to D_Coder",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.rejectApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        isAccepted: -1,
      }
    );

    const mailRes = sendMail({
      from: "faangpledgemailer@gmail.com",
      to: update_applicant.email,
      subject: "Rejected Application",
      text: "Thanks for applying tho",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// For Recruiter

module.exports.setInterview = async (req, res) => {
  const { id, interviewerName, interviewTime, interviewLink } = req.body;
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        interviewTime: interviewTime,
        interviewLink: interviewLink,
        interviewerName: interviewerName,
      }
    );

    const mailRes = sendMail({
      from: "faangpledgemailer@gmail.com",
      to: update_applicant.email,
      subject: "Interview has been set",
      text: "Details of interview!",
    });

    return res.status(200).json({
      message: "Successfully set interview",
      success: true,
      mailRes: mailRes,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.setMarks = async (req, res) => {
  const {
    id,
    taskCompletionScore,
    codingSkillsScore,
    enthusiasmScore,
    remarksByRecruiter,
  } = req.body;
  const totalScore =
    parseInt(taskCompletionScore) +
    parseInt(codingSkillsScore) +
    parseInt(enthusiasmScore);
  try {
    const update_applicant = await UserApplied.findOneAndUpdate(
      { _id: id },
      {
        taskCompletionScore,
        codingSkillsScore,
        enthusiasmScore,
        totalScore,
        remarksByRecruiter,
        interviewCompleted: true,
      }
    );

    return res.status(200).json({
      message: "Successfully marked!",
      success: true,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
