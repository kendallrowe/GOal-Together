import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import useApplicationData from "./hooks/useApplicationData";
import classes from "./App.module.scss";
import { findUserCommitmentScore } from "./helpers/helpers";

import ActivityList from "./components/activity/ActivityList";
import CommitmentList from "./components/commitments/CommitmentList";
import VoterCard from "./components/vote/voterCard";
import TopNav from "./components/nav_bar/TopNav";
import BottomNav from "./components/nav_bar/BottomNav";
import NewCommitmentForm from "./components/new_commitment_form/index";
import Profile from "./components/profile/index";
import Commitment from "./components/commitment/index";
import Login from "./components/authentication/Login";
import Logout from "./components/authentication/Logout";
import Register from "./components/authentication/Register";
import Leaderboard from "./components/leaderboard/Leaderboard";

function App() {
  const {
    state,
    setTitle,
    setNewCommitment,
    getNotifications,
    getCommitment,
    submitActivity,
    setUser,
    submitVote
  } = useApplicationData();
  console.log(state);
  useEffect(() => {
    document.title = state.title;
  }, [state.title]);

  useEffect(() => {
    getNotifications();
  }, [state.activities]);

  return (
    <Router>
      <TopNav Link={Link} user={state.user} />
      <Route
        exact
        path="/"
        render={() =>
          state.user.id ? <Redirect to="/profile" /> : <Redirect to="/login" />
        }
      />
      <Route
        exact
        path="/login"
        render={props =>
          state.user && state.user.id ? (
            <Redirect to="/profile" />
          ) : (
            <LoginPage
              {...props}
              setUser={setUser}
              getNotifications={getNotifications}
              setTitle={setTitle}
            />
          )
        }
      />
      <Route
        exact
        path="/logout"
        render={props => <LogoutPage {...props} setUser={setUser} />}
      />
      <Route
        exact
        path="/register"
        render={props =>
          state.user && state.user.id ? (
            <Redirect to="/profile" />
          ) : (
            <RegisterPage
              {...props}
              setUser={setUser}
              getNotifications={getNotifications}
              setTitle={setTitle}
            />
          )
        }
      />
      <Route
        exact
        path="/commitments"
        render={props =>
          state.user && state.user.id ? (
            <Commitments
              {...props}
              state={state}
              setTitle={setTitle}
              Link={Link}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Switch>
        <Route
          exact
          path="/commitments/new"
          render={props =>
            state.user && state.user.id ? (
              <NewCommitment
                {...props}
                setTitle={setTitle}
                setNewCommitment={setNewCommitment}
                getNotifications={getNotifications}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          exact
          path={`/commitments/:commitmentId`}
          render={props =>
            state.user && state.user.id ? (
              <CommitmentPage
                {...props}
                title={state.title}
                commitments={state.commitments}
                setTitle={setTitle}
                activities={state.activities}
                getNotifications={getNotifications}
                members={state.members}
                submitVote={submitVote}
                user={state.user}
                submitActivity={submitActivity}
              />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
      </Switch>
      <Route
        exact
        path="/notifications"
        render={props =>
          state.user && state.user.id ? (
            <Notifications
              {...props}
              activities={state.activities}
              setTitle={setTitle}
              submitVote={submitVote}
              members={state.members}
              user={state.user}
              notifications={state.notifications}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />

      <Route
        exact
        path="/profile"
        render={props =>
          state.user && state.user.id ? (
            <ProfilePage {...props} 
            setTitle={setTitle}
            user={state.user}
            numberOfCommitments={Object.keys(state.commitments).length}
            numberOfActivities={Object.keys(state.activities).length}
            members={state.members}
            loading={state.loading}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route
        exact
        path="/leaderboard"
        render={props =>
          state.user && state.user.id ? (
            <LeaderBoardPage {...props} members={state.members} setTitle={setTitle} user={state.user} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />

      <Route
        exact
        path="/vote"
        render={props =>
          state.user && state.user.id ? (
            <Vote
              {...props}
              state={state}
              setTitle={setTitle}
              submitVote={submitVote}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <BottomNav notifications={state.notifications} Link={Link} />
    </Router>
  );
}

function LoginPage({ match, setUser, setTitle }) {
  if (document.title !== "Login") {
    setTitle("Login");
  }
  return <Login setUser={setUser} />;
}

function LogoutPage({ match, setUser }) {
  return <Logout setUser={setUser} />;
}

function RegisterPage({ setUser, setTitle }) {
  if (document.title !== "Register") {
    setTitle("Register");
  }
  return <Register setUser={setUser} />;
}

function Vote({ state, submitVote }) {
  return (
    <div>
      {/* will also need to pass info about activity id */}
      <VoterCard
        members={state.members}
        user={state.user}
        activity={state.activity}
        submitVote={submitVote}
      />
    </div>
  );
}

function CommitmentPage({
  match,
  commitments,
  title,
  setTitle,
  activities,
  submitVote,
  submitActivity,
  members,
  user,
  getNotifications
}) {
  const commitment = commitments[parseInt(match.params.commitmentId, 10)];

  const commitment_activities = Object.keys(activities).length > 0 ? Object.values(activities).filter(
    activity => activity.commitment_id === commitment.id
  ) : {};

  if (commitment && document.title !== commitment.name) {
    setTitle(commitment.name);
  }

  let attendance = [];

  for (const memberId in commitment.attendance) {
    const name = members[memberId].first_name;
    if (name) {
      const commitmentScore = commitment.attendance[memberId];
      const imageId = members[memberId].avatar_url;
      attendance.push({ name, commitmentScore, imageId });
    }
  }

  attendance = attendance.sort((a, b) => b.commitmentScore - a.commitmentScore);
  let keenest = { name: "it's too close to call!", commitmentScore: 100, imageId: "qb3bao7kv87dznw2jnl8"}
  let flakiest = { name: "it's too close to call!", commitmentScore: 100, imageId: "qb3bao7kv87dznw2jnl8"}
  if (attendance.length > 0) {
    keenest = attendance[0].commitmentScore === attendance[1].commitmentScore ? { name: "it's too close to call!", commitmentScore: attendance[0].commitmentScore, imageId: "qb3bao7kv87dznw2jnl8"} : attendance[0];
    flakiest = attendance[attendance.length - 1].commitmentScore === attendance[attendance.length - 2].commitmentScore ? { name: "it's too close to call!", commitmentScore: attendance[attendance.length - 1].commitmentScore, imageId: "qb3bao7kv87dznw2jnl8"} : attendance[attendance.length - 1];
  }
  
  return (
    <Commitment
      flakiest={flakiest} 
      keenest={keenest}
      attendance={attendance.slice(0, 10)} 
      activities={commitment_activities}
      commitment={commitment}
      title={title}
      submitVote={submitVote}
      members={members}
      user={user}
      userCommitmentScore={commitment.attendance ? commitment.attendance[user.id] : 100}
      submitActivity={submitActivity}
    />
  );
}

function Commitments({ match, state, setTitle, Link }) {
  if (document.title !== "Commitments") {
    setTitle("Commitments");
  }

  return (
    <CommitmentList
      commitments={state.commitments}
      members={state.members}
      Link={Link}
      match={match}
    />
  );
}

function Notifications({
  match,
  activities,
  setTitle,
  submitVote,
  members,
  user,
  notifications
}) {
  if (document.title !== "Notifications") {
    setTitle("Notifications");
  }
  return (
    <ActivityList
      notifications={notifications}
      activities={activities}
      members={members}
      submitVote={submitVote}
      user={user}
    />
  );
}

function NewCommitment({ history, setNewCommitment, setTitle }) {
  if (document.title !== "New Commitment") {
    setTitle("New Commitment");
  }
  return <NewCommitmentForm history={history} setNewCommitment={setNewCommitment} />;
}

function ProfilePage({ user, setTitle, numberOfCommitments, numberOfActivities, members, loading }) {
  if (document.title !== "Profile") {
    setTitle("Profile");
  }
  
  let userCommitmentScore = findUserCommitmentScore(user.email, members);
  
  return loading === false ? <Profile user={user} numberOfActivities={numberOfActivities} numberOfCommitments={numberOfCommitments} userCommitmentScore={userCommitmentScore} /> : <div></div>;
}

function LeaderBoardPage({ setTitle, members, user }) {
  if (document.title !== "Leaderboard") {
    setTitle("Leaderboard");
  }
  let attendance = [];
  for (const id in members) {
    const name = members[id].first_name;
    if (name) {
      const commitmentScore = members[id].commitment_score;
      const imageId = members[id].avatar_url;
      attendance.push({ name, commitmentScore, imageId });
    }
  }
  attendance = attendance.sort((a, b) => b.commitmentScore - a.commitmentScore);
  let keenest = undefined;
  let flakiest = undefined;
  if (attendance.length > 0) {
    keenest = attendance[0].commitmentScore === attendance[1].commitmentScore ? { name: "It's too close to call!", commitmentScore: attendance[0].commitmentScore, imageId: "qb3bao7kv87dznw2jnl8" } : attendance[0];
    flakiest = attendance[attendance.length - 1].commitmentScore === attendance[attendance.length - 2].commitmentScore ? { name: "It's too close to call!", commitmentScore: attendance[attendance.length - 1].commitmentScore, imageId: "qb3bao7kv87dznw2jnl8" } : attendance[attendance.length - 1];
  }

  let userCommitmentScore = findUserCommitmentScore(user.email, members);

  return <Leaderboard 
    flakiest={flakiest} 
    keenest={keenest}
    attendance={attendance.slice(0, 10)} 
    title={document.title} 
    userName={user.first_name} 
    userCommitmentScore={userCommitmentScore} 
  />;
}

export default App;
