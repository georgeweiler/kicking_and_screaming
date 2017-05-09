"use strict";

var globalPlayers = [];

var globalPositions = ["pitcher", "catcher", "first base", "second base", "thurd base", "short stop", "left center", "right center", "left outfield", "center outfield", "right outfield"];
var globalBattingLineup = [];
var globalCurrentlyAtBat = void 0;
var globalPlayersWithoutSubs = void 0;
var globalKScore = 0;
var globalOtherScore = 0;

function addPlayer() {
  if ($('#add-player-input').val() === "") {
    return;
  }
  var playerObj = {
    name: $('#add-player-input').val()
  };

  if (_.find(globalPlayers, function (player) {
    return player.name === playerObj.name;
  })) {
    alert("names must be unique. choose a nickname");
  } else {

    // 11 people already assigned -- START ASSIGNING SUBS
    if (globalPositions.length === 0) {
      //LOL GOOD LUCK UNDERSTANDING THIS SHIT
      globalPlayersWithoutSubs = _.filter(globalPlayers, function (player) {
        return !player.hasSub;
      }).map(function (player) {
        return player.name;
      });
      var playerIdx = Math.floor(Math.random() * globalPlayersWithoutSubs.length);
      playerObj.position = "Sub for: " + globalPlayersWithoutSubs[playerIdx];
      playerObj.hasSub = true;
      var sub = _.findWhere(globalPlayers, { name: globalPlayersWithoutSubs[playerIdx] });
      if (!sub) {
        alert('jesus christ kick just some people off the team');
        return;
      }
      playerObj.sub = sub.name;
      sub.hasSub = true;
      sub.sub = playerObj.name;
      globalPlayersWithoutSubs = _.without(globalPlayersWithoutSubs, globalPlayersWithoutSubs[playerIdx]);
    } else {
      var posIdx = Math.floor(Math.random() * globalPositions.length);
      playerObj.position = globalPositions[posIdx];
      globalPositions = _.without(globalPositions, playerObj.position);
    }

    playerObj.isStarter = globalPositions.length > 0;
    globalPlayers.push(playerObj);

    $('#player-list').prepend("\n        <tr>\n          <td class='player-td'>" + playerObj.name + "</td>\n          <td class='position-td'>" + playerObj.position + "</td>\n        </tr>\n    ");
    //`<td><a id='foo' class="btn-floating btn-xsmall waves-effect waves-light red" onclick='removePlayer(this)'><i class="material-icons">thumb_down</i></a></td>`        
  }
  $('#add-player-input').val("");
}

function createBattingLineup() {
  if (globalPlayers.length < 11) {
    alert('you need more players');
    return;
  }
  var shuffledPlayers = _.shuffle(globalPlayers);
  var alreadyAdded = [];
  while (shuffledPlayers.length) {
    var randomPlayer = shuffledPlayers.pop();
    if (!randomPlayer.hasSub) {
      globalBattingLineup.push([randomPlayer.name]);
    } else {
      if (!_.contains(alreadyAdded, randomPlayer.name) || !_.contains(alreadyAdded, randomPlayer.sub)) {
        alreadyAdded.push(randomPlayer.name);
        alreadyAdded.push(randomPlayer.sub);
        globalBattingLineup.push([randomPlayer.name, randomPlayer.sub]);
      }
    }
  }
  rotateBattingLineup();
  $('#start-game-btn').hide();
}
createBattingLineup = _.once(createBattingLineup);

function rotateBattingLineup() {
  globalCurrentlyAtBat = globalBattingLineup.shift();
  $('#up-to-bat').html("<li class='list-group-item'>" + globalCurrentlyAtBat[0] + "</li>");
  if (globalCurrentlyAtBat.length === 1) {
    globalBattingLineup.push(globalCurrentlyAtBat);
  } else {
    var temp = [globalCurrentlyAtBat[1], globalCurrentlyAtBat[0]];
    globalBattingLineup.push(temp);
  }
  var html = '';
  for (var i = 0; i < 3; i++) {
    html += "<li class='list-group-item'>" + globalBattingLineup[i][0] + "</li>";
  }
  $('#batting-lineup').html(html);
}
function nextAtBat() {
  rotateBattingLineup();
}
function addKScore() {
  globalKScore++;
  $("#ks-score").text(globalKScore);
}
function addOScore() {
  globalOtherScore++;
  $("#other-score").text(globalOtherScore);
}
function minusKScore() {
  globalKScore--;
  $("#ks-score").text(globalKScore);
}
function minusOScore() {
  globalOtherScore--;
  $("#other-score").text(globalOtherScore);
}
