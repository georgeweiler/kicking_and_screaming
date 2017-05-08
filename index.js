let globalPlayers = [
  {
    "name":"1",
    "position":"second base",
    "isStarter":true,
    "hasSub":true,
    "sub":"15"
  },
  { 
    "name":"2",
    "position":"left outfield",
    "isStarter":true,
    "hasSub":true,
    "sub":"20"
  },
  {
    "name":"3",
    "position":"center outfield",
    "isStarter":true,
    "hasSub":true,
    "sub":"12"
  },
  {
    "name":"4",
    "position":"right outfield",
    "isStarter":true,
    "hasSub":false
  },
  {
    "name":"5",
    "position":"thurd base",
    "isStarter":true,
    "hasSub":true,
    "sub":"14"
  },
  {
    "name":"6",
    "position":"pitcher",
    "isStarter":true,
    "hasSub":true,
    "sub":"18"
  },
  {
    "name":"7",
    "position":"right center",
    "isStarter":true,
    "hasSub":true,
    "sub":"17"
  },
  {
    "name":"8",
    "position":"first base",
    "isStarter":true,
    "hasSub":true,
    "sub":"13"
  },
  {
    "name":"9",
    "position":"short stop",
    "isStarter":true,
    "hasSub":true,
    "sub":"16"
  },
  {
    "name":"10",
    "position":"catcher",
    "isStarter":true,
    "hasSub":true,
    "sub":"19"
  },
  {
    "name":"11",
    "position":"left center",
    "isStarter":false,
    "hasSub":false
  },
  {
    "name":"12",
    "position":"Sub for: 3",
    "hasSub":true,
    "sub":"3",
    "isStarter":false
  },
  {
    "name":"13",
    "position":"Sub for: 8",
    "hasSub":true,
    "sub":"8",
    "isStarter":false
  },
  {
    "name":"14",
    "position":"Sub for: 5",
    "hasSub":true,
    "sub":"5",
    "isStarter":false
  },
  {
    "name":"15",
    "position":"Sub for: 1",
    "hasSub":true,
    "sub":"1",
    "isStarter":false
  },
  {
    "name":"16",
    "position":"Sub for: 9",
    "hasSub":true,
    "sub":"9",
    "isStarter":false
  },
  {
    "name":"17",
    "position":"Sub for: 7",
    "hasSub":true,
    "sub":"7",
    "isStarter":false
  },
  {
    "name":"18",
    "position":"Sub for: 6",
    "hasSub":true,
    "sub":"6",
    "isStarter":false
  },
  {
    "name":"19",
    "position":"Sub for: 10",
    "hasSub":true,
    "sub":"10",
    "isStarter":false
  },
  {
    "name":"20",
    "position":"Sub for: 2",
    "hasSub":true,
    "sub":"2",
    "isStarter":false
  }
]

let globalPositions = [
  "pitcher",
  "catcher",
  "first base",
  "second base",
  "thurd base",
  "short stop",
  "left center",
  "right center",
  "left outfield",
  "center outfield",
  "right outfield"
];
let globalBattingLineup = [];
let globalCurrentlyAtBat;
let globalPlayersWithoutSubs;
function addPlayer(){
  let playerObj = {
    name: $('#add-player-input').val()
  }
  
  if(_.find(globalPlayers, (player)=> player.name === playerObj.name)){
    alert("names must be unique. choose a nickname")
  } else{
    
    // 11 people already assigned -- START ASSIGNING SUBS
    if(globalPositions.length === 0){
      //LMAO GOOD LUCK UNDERSTANDING THIS SHIT
      globalPlayersWithoutSubs = _.filter(globalPlayers, player => !player.hasSub).map(player => player.name);
      playerIdx = Math.floor(Math.random()*globalPlayersWithoutSubs.length);
      playerObj.position = `Sub for: ${globalPlayersWithoutSubs[playerIdx]}`;
      playerObj.hasSub = true;
      let sub = _.findWhere(globalPlayers, {name: globalPlayersWithoutSubs[playerIdx]});
      if(!sub){
        alert('jesus christ kick just some people off the team')
        return;
      }
      playerObj.sub = sub.name;
      sub.hasSub = true;
      sub.sub = playerObj.name;
      globalPlayersWithoutSubs = _.without(globalPlayersWithoutSubs, globalPlayersWithoutSubs[playerIdx]);
    } else {
      let posIdx = Math.floor(Math.random()*globalPositions.length);
          playerObj.position = globalPositions[posIdx];
          globalPositions = _.without(globalPositions, playerObj.position);
    }

    playerObj.isStarter = globalPositions.length > 0;
    globalPlayers.push(playerObj);
    
    $('#player-list').prepend(`
        <tr>
          <td class='player-td'>${playerObj.name}</td>
          <td class='position-td'>${playerObj.position}</td>
        </tr>
    `);
  //`<td><a id='foo' class="btn-floating btn-xsmall waves-effect waves-light red" onclick='removePlayer(this)'><i class="material-icons">thumb_down</i></a></td>`        
  }
 $('#add-player-input').val("");
}

function createBattingLineup(){
  let shuffledPlayers = _.shuffle(globalPlayers);
  let alreadyAdded = [];
  while(shuffledPlayers.length){
    let randomPlayer = shuffledPlayers.pop();
    if(!randomPlayer.hasSub){
      globalBattingLineup.push([randomPlayer.name])
    } 
    else {
      if(!_.contains(alreadyAdded, randomPlayer.name) || !_.contains(alreadyAdded, randomPlayer.sub))
        alreadyAdded.push(randomPlayer.name)
        alreadyAdded.push(randomPlayer.sub)
        globalBattingLineup.push([randomPlayer.name, randomPlayer.sub])
      }
    }
  rotateBattingLineup()
  $('#start-game-btn').hide();
}
createBattingLineup = _.once(createBattingLineup);

function rotateBattingLineup(){
  globalCurrentlyAtBat = globalBattingLineup.shift();
  $('#up-to-bat').html(`<li class='list-group-item'>${globalCurrentlyAtBat[0]}</li>`);
  if(globalCurrentlyAtBat.length === 1){
    globalBattingLineup.push(globalCurrentlyAtBat);
  } else {
    let temp = [
      globalCurrentlyAtBat[1],
      globalCurrentlyAtBat[0]
    ];
    globalBattingLineup.push(temp);
  }
  let html = '';
  for(var i = 0; i<3; i++){
    html += `<li class='list-group-item'>${globalBattingLineup[i][0]}</li>`;
  }
  $('#batting-lineup').html(html)
}
function nextAtBat(){
  rotateBattingLineup()
}




// function removePlayer(btn){
//   let player = $(btn).parent().siblings('.player-td').text()
//   let position = $(btn).parent().siblings('.position-td').text()
//   globalPlayers = _.without(globalPlayers, _.findWhere(globalPlayers, {name: player}));
//   globalPositions.push(position)
//   $(btn).closest('tr').remove();
// }