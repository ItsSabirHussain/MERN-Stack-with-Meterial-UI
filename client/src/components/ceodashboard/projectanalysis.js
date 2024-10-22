import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link to="/">Complex Bid Module Integration</Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(1, 1, 1)
  },
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));

export default function Notifications(props) {
  function AllPlacesList(p) {
    return p.map(function(cdata, i) {
      return <Data data={cdata} key={i} />;
    });
  }
  const Data = p => (
    <tr>
      <td>{p.data.ID}</td>
      <td>{p.data.ProjectName}</td>
      <td>{p.data.CompanyName}</td>
      <td>{p.data.Suggestion}</td>
      <td>{p.data.Cost}</td>
      <td>{p.data.Budget}</td>
      <td>{p.data.RiskFactor}</td>
      <td>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={e => {
            localStorage.setItem("e_id", p.data._id);
            props.history.push("/ceodashboard/modify");
          }}
        >
          Accept
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={e => {
            e.preventDefault();
            axios
              .post("/updatebidstatus", {
                _id: p.data._id,
                ProjectName: p.data.ProjectName,
                CompanyName: p.data.CompanyName,
                ID: p.data.ID,
                Bid: p.data.Cost,
                Reason: prompt("Enter the reacson of rejection"),
                Status: "Rejected"
              })
              .then(res => {
                alert("Action completed.");
              })
              .catch(error => {
                alert(error);
              });
            props.history.push("/ceodashboard");
          }}
        >
          Rejected
        </Button>
      </td>
    </tr>
  );

  const [AllStatus, setAllStatus] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    if (AllStatus.length < 1) {
      axios
        .post("/getanalysisdata", {})
        .then(res => {
          setAllStatus(res.data);
        })
        .catch(error => console.log(error));
    }
  });
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>
              <h3>Project Analysis Data</h3>
              <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Project Name</th>
                    <th>Company Name</th>
                    <th>Suggestions</th>
                    <th>Cost</th>
                    <th>Budget</th>
                    <th>Risk Factors</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{AllPlacesList(AllStatus)}</tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Copyright />
    </main>
  );
}
