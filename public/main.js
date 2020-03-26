const form = document.getElementById("vote-form");

form.addEventListener("submit", e => {
  const choice = document.querySelector("input[name=sm]:checked").value;
  const data = {
    sm: choice
  };

  fetch("http://localhost:9000/vote", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .then(data => console.log(data.message))
    .catch(err => console.log(err));
  e.preventDefault();
});

fetch("http://localhost:9000/vote")
  .then(res => res.json())
  .then(data => {

    let votes = data.votes;
    let totalVotes = votes.length;
    document.querySelector(
      "#chartTitle"
    ).textContent = `Total votes ${totalVotes}`;

    var res = {
      Facebook:0,
      Instagram :0,
      LinkedIn:0,
      Snapchat:0,
      Twitter:0,
      YouTube:0
    }
    votes.forEach(function(v) {
      res[v.sm] = (res[v.points] || 0) + parseInt(v.points);
    });
     
    let dataPoints = [
      { label: "Facebook", y: res.Facebook },
      { label: "Instagram", y: res.Instagram },
      { label: "LinkedIn", y: res.LinkedIn },
      { label: "Snapchat", y: res.Snapchat },
      { label: "Twitter", y: res.Twitter },
      { label: "YouTube", y: res.YouTube }
    ];

    const chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      document.addEventListener("votesAdded", e => {
        document.querySelector("#chartTitle").textContent = `Total votes: ${e.detail.totalVotes}`;
      });

      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme1",
        data: [
          {
            type: "column",
            dataPoints: dataPoints
          }
        ]
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      let pusher = new Pusher("52e12310a250a9241bc7", {
        cluster: "eu",
        useTLS: true
      });

      let channel = pusher.subscribe("sm-vote");
     
      
      channel.bind("vote", function(data) {
        dataPoints.forEach(point => {
          if (point.label === data.sm) {
            point.y += data.points;
            totalVotes += data.points;
            event = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}})
            document.dispatchEvent(event)
          }
        });
        chart.render();
      });
    }
  })
  
