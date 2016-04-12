//PokerPlayback
var needreplay = false;
var waitingToShowReplayMask = false;
var PokerPlayback = function(io) {
	var playerPos = function(_x, _y) {
		this.name = {
			x : _x,
			y : _y - 68
		};
		this.icon = {
			x : _x,
			y : _y
		};
		this.chips = {
			x : _x,
			y : _y + 63
		};
		this.pattern = {
			x : _x,
			y : _y + 90
		};
		this.dealer = {
			x : _x + 50,
			y : _y + 54
		};
		this.blind = {
			x : _x + 20,
			y : _y - 34
		};
		this.bet = {
			x : _x,
			y : _y - 53
		};
		this.holecard = [ {
			x : _x + 7,
			y : _y + 19
		}, {
			x : _x + 27,
			y : _y + 19
		} ];
		this.holecardGray = [ {
			x : _x + 7,
			y : _y + 19
		}, {
			x : _x + 27,
			y : _y + 19
		} ];
		this.holecardBlink = [ {
			x : _x + 7,
			y : _y + 19
		}, {
			x : _x + 27,
			y : _y + 19
		} ];
		this.bubble = {
			x : _x,
			y : _y - 12
		};
		this.win = {
			x : _x,
			y : _y - 33
		};
	}
	playerPos.prototype.adjust = function(x, y) {
		this.name.x = x;
		this.name.y = y;
		this.icon.x = x;
		this.icon.y = y + 68;
		this.chips.x = x;
		this.chips.y = y + 158;
		this.pattern.x = x;
		this.patter.y = y + 158;
		this.dealer.x = x + 65;
		this.dealer.y = y + 148;
		this.blind.x = x + 20;
		this.blind.y = y - 112;
		this.bet.x = x;
		this.bet.y = y - 57;
		this.holecard[0].x = x - 25;
		this.holecard[0].y = y + 73;
		this.holecard[1].x = x + 16;
		this.holecard[1].y = y + 73;
		this.bubble.x = x;
		this.bubble.y = y + 6;
		this.win.x = x;
		this.win.y = y - 57;
	}

	var playerPositions = [ {}, (new playerPos(320, 375)),
			(new playerPos(190, 375)), (new playerPos(90, 330)),
			(new playerPos(90, 150)), (new playerPos(230, 85)),
			(new playerPos(410, 85)), (new playerPos(550, 150)),
			(new playerPos(550, 330)), (new playerPos(450, 375)), ];

	for (var i = 4; i <= 7; i++) {
		var tempx = playerPositions[i].chips.x;
		var tempy = playerPositions[i].chips.y;
		playerPositions[i].chips.x = playerPositions[i].bet.x;
		playerPositions[i].chips.y = playerPositions[i].bet.y;
		playerPositions[i].bet.x = tempx;
		playerPositions[i].bet.y = tempy;
	}

	var potPosition = {
		x : 570,
		y : 30
	}, boardPositions = [ {
		x : 205,
		y : 230
	}, {
		x : 263,
		y : 230
	}, {
		x : 321,
		y : 230
	}, {
		x : 379,
		y : 230
	}, {
		x : 437,
		y : 230
	} ];
	// var i, record = recordHelper.data, table = record.STAGE.TABLE, seats =
	// table.SEAT, pokercard = record.STAGE.POKERCARD;
	var i, record, table, seats, pokercard;
	// recordHelper.nextRoundId = record.STAGE.NEXT_ROUND;
	var iconRadius = 35, cardScale = {
		x : 58,
		y : 78
	}, cardScaleSmall = {
		x : 20,
		y : 35
	}, bubbleScale = {
		x : 99,
		y : 65
	}, chipsScale = {
		x : 77,
		y : 26
	}, betBgScale = {
		x : 77,
		y : 24
	};
	// if (table.SEATS == 5) {
	// playerPositions = playerPositions5;
	// }
	io.setBGImage('http://upyun.pokermate.net/handplayer/res/bg.png');

	io.addGroup('table'); // 头像、名称、筹码组
	// io.addGroup('dinamic'); //可变物体
	/*
	 * for (i = 0; i < playerPositions.length; i++) { //占位背景
	 * io.addToGroup('table', new iio.SimpleRect(playerPositions[i].icon, 120,
	 * 150) .setFillStyle('white') .setAlpha(.1) ); };
	 */

	function showTest() {
		record = recordHelper.data;
		table = record.STAGE.TABLE;
		seats = table.SEAT;
		recordHelper.progress_bar.style.width = '0%';
		pokercard = record.STAGE.POKERCARD;
		recordHelper.echo('德州扑克圈 - 文字牌谱');
		recordHelper.echo(table.TITLE + ' ' + record.STAGE.TIME);
		recordHelper.echo('************');
		recordHelper.echo('庄家座位号: #' + table.DEALER);

		for (i = 0; i < 9; i++) {

			(function(pos) {
				playerPositions[i + 1].icon.obj = new iio.Circle(
						playerPositions[i + 1].icon, iconRadius)
						.setStrokeStyle('white', 2).addImage(
								'http://upyun.pokermate.net/handplayer/res/icon.png',
								function() {
									io.addToGroup('table',
											playerPositions[pos].icon.obj);
								}); // 头像
			})(i + 1);

			// playerPositions[i+1].name.obj = new iio.Text('测试名字',
			// playerPositions[i+1].name)
			// .setFont('24px Microsoft YaHei')
			// .setTextAlign('center')
			// .setFillStyle('white'); // 名称
			// io.addToGroup('table', playerPositions[i+1].name.obj);
			//	    	
			(function(pos) {
				playerPositions[i + 1].dealer.obj = new iio.SimpleRect(
						playerPositions[i + 1].dealer, 20).addImage(
						'http://upyun.pokermate.net/handplayer/res/dealer.png', function() {
							io.addToGroup('table',
									playerPositions[pos].dealer.obj);
						}); // dealer
			})(i + 1);

			(function(pos) {
				playerPositions[i + 1].chips.objBG = new iio.SimpleRect(
						playerPositions[i + 1].chips.x,
						playerPositions[i + 1].chips.y - 9, chipsScale.x,
						chipsScale.y).addImage('http://upyun.pokermate.net/handplayer/res/back.png',
						function() {
							io.addToGroup('layerone',
									playerPositions[pos].chips.objBG);
							playerPositions[pos].chips.obj = new iio.Text(
									recordHelper.chipsFormat(2026),
									playerPositions[pos].chips).setFont(
									'24px Myriad Pro').setTextAlign('center')
									.setFillStyle('#ffe0a3'); // 筹码
							playerPositions[pos].chips.obj.chips = 2026;
							io.addToGroup('layertwo',
									playerPositions[pos].chips.obj);
						});
			})(i + 1);

			(function(pos) {
				playerPositions[i + 1].bet.objBG = new iio.SimpleRect(
						playerPositions[i + 1].bet.x,
						playerPositions[i + 1].bet.y, betBgScale.x,
						betBgScale.y).addImage('http://upyun.pokermate.net/handplayer/res/chips.png', function() {
					// recordHelper.soundPlay('chipThrow');
					io.addToGroup('table', playerPositions[pos].bet.objBG);
					playerPositions[pos].bet.obj = new iio.Text(recordHelper
							.chipsFormat(200), playerPositions[pos].bet.x - 9,
							playerPositions[pos].bet.y + 8).setFont(
							'24px Myriad Pro').setTextAlign('left')
							.setFillStyle('white'); // 筹码出
					io.addToGroup('layer2', playerPositions[pos].bet.obj, 2);
				});

			})(i + 1);

			(function(pos) {
				playerPositions[i + 1].holecard[0].obj = new iio.SimpleRect(
						playerPositions[i + 1].holecard[0], cardScale.x,
						cardScale.y).addImage('http://upyun.pokermate.net/handplayer/res/1s.png', function() {
					io
							.addToGroup('table',
									playerPositions[pos].holecard[0].obj);

				}); // 底牌2
				playerPositions[pos].holecard[1].obj = new iio.SimpleRect(
						playerPositions[pos].holecard[1], cardScale.x,
						cardScale.y).addImage('http://upyun.pokermate.net/handplayer/res/2s.png', function() {
					io
							.addToGroup('table',
									playerPositions[pos].holecard[1].obj);
				}); // 底牌1

			})(i + 1);
			//			
			// /////////////////气泡
			(function(pos) {
				playerPositions[i + 1].bubble.obj = new iio.SimpleRect(
						playerPositions[i + 1].bubble, bubbleScale.x,
						bubbleScale.y).addImage('http://upyun.pokermate.net/handplayer/res/call.png', function() {
					io.addToGroup('table', playerPositions[pos].bubble.obj);
				});
			})(i + 1);

		}
		;

		potPosition.objBG = new iio.SimpleRect(potPosition, 111, 40).addImage(
				'http://upyun.pokermate.net/handplayer/res/pot.png', function() {
					io.addToGroup('table', potPosition.objBG);
					potPosition.obj = new iio.Text('0', potPosition.x + 12,
							potPosition.y + 11).setFont('20px Microsoft YaHei')
							.setTextAlign('center').setFillStyle('white'); // 奖池
					potPosition.obj.chips = 0;
					io.addToGroup('table', potPosition.obj);
				});

		for (var i = 0; i < 5; i++) {
			(function(pos) {
				boardPositions[pos].obj = new iio.SimpleRect(
						boardPositions[pos], cardScale.x, cardScale.y)
						.addImage('http://upyun.pokermate.net/handplayer/res/1s.png', function() {
							io.addToGroup('table', boardPositions[pos].obj);

						}); // 公共牌

			})(i);

		}

	}

	function initTable() {
		record = recordHelper.data;
		table = record.STAGE.TABLE;
		seats = table.SEAT;
		recordHelper.progress_bar.style.width = '0%';
		pokercard = record.STAGE.POKERCARD;
		recordHelper.nextRoundId = record.STAGE.NEXT_ROUND;
		recordHelper.echo('德州扑克圈 - 文字牌谱');
		recordHelper.echo(table.TITLE + ' ' + record.STAGE.TIME);
		recordHelper.echo('************');
		recordHelper.echo('庄家座位号: #' + table.DEALER);

		for (i = 0; i < seats.length; i++) {
			recordHelper.echo(seats[i].NUMBER + '号座位 ' + ': ' + seats[i].NAME
					+ ' ( ' + seats[i].CHIPS + '$ )');
			if (seats[i].ICON == '') {
				seats[i].ICON = 'http://upyun.pokermate.net/handplayer/res/icon.png';
			}

			(function(pos) {
				playerPositions[seats[i].NUMBER].icon.obj = new iio.Circle(
						playerPositions[seats[i].NUMBER].icon, iconRadius)
						.setStrokeStyle('white', 2).addImage(
								seats[i].ICON,
								function() {
									io.addToGroup('table',
											playerPositions[pos].icon.obj);
								}); // 头像
			})(seats[i].NUMBER);

			// playerPositions[seats[i].NUMBER].name.obj = new
			// iio.Text(seats[i].NAME, playerPositions[seats[i].NUMBER].name)
			// .setFont('24px Microsoft YaHei')
			// .setTextAlign('center')
			// .setFillStyle('white'); // 名称
			// io.addToGroup('table',
			// playerPositions[seats[i].NUMBER].name.obj);

			(function(pos) {
				playerPositions[seats[i].NUMBER].chips.objBG = new iio.SimpleRect(
						playerPositions[seats[i].NUMBER].chips.x,
						playerPositions[seats[i].NUMBER].chips.y - 9,
						chipsScale.x, chipsScale.y)
						.addImage(
								'http://upyun.pokermate.net/handplayer/res/back.png',
								function() {
									io
											.addToGroup(
													'table',
													playerPositions[seats[pos].NUMBER].chips.objBG);

									(function(i) {
										playerPositions[seats[i].NUMBER].chips.obj = new iio.Text(
												recordHelper
														.chipsFormat(seats[i].CHIPS),
												playerPositions[seats[i].NUMBER].chips)
												.setFont('24px Myriad Pro')
												.setTextAlign('center')
												.setFillStyle('#ffe0a3'); // 筹码
										playerPositions[seats[i].NUMBER].chips.obj.chips = seats[i].CHIPS;
										io
												.addToGroup(
														'table4',
														playerPositions[seats[i].NUMBER].chips.obj,
														4);
									})(pos);

								});
			})(i);

		}
		;
		for (i = 1; i < playerPositions.length; i++) {
			if (typeof playerPositions[i].icon.obj == 'undefined') {
				(function(pos) {
					playerPositions[i].icon.obj = new iio.Circle(
							playerPositions[i].icon, iconRadius).addImage(
							'http://upyun.pokermate.net/handplayer/res/empty.png', function() {
								io.addToGroup('table',
										playerPositions[pos].icon.obj);
							}); // 头像
				})(i);

			}
		}
		;

		if (table.DEALER != "") {
			(function(pos) {
				playerPositions[table.DEALER].dealer.obj = new iio.SimpleRect(
						playerPositions[table.DEALER].dealer, 20).addImage(
						'http://upyun.pokermate.net/handplayer/res/dealer.png', function() {
							io.addToGroup('table',
									playerPositions[pos].dealer.obj);
						}); // dealer
			})(table.DEALER);

		}

		potPosition.objBG = new iio.SimpleRect(potPosition, 111, 40).addImage(
				'http://upyun.pokermate.net/handplayer/res/pot.png', function() {
					io.addToGroup('table', potPosition.objBG);
					potPosition.obj = new iio.Text('0', potPosition.x + 12,
							potPosition.y + 11).setFont('20px Microsoft YaHei')
							.setTextAlign('center').setFillStyle('white'); // 奖池
					potPosition.obj.chips = 0;
					io.addToGroup('table', potPosition.obj);
				});

	}

	function blindShowUndo() {
		bubbleClear();
		recordHelper.echo('************');
		if (typeof playerPositions[table.SBLIND.NUMBER].bet.objBG != 'undefined') {
			io.rmvObj(playerPositions[table.SBLIND.NUMBER].bet.objBG);
			playerPositions[table.SBLIND.NUMBER].bet.objBG = undefined;
		}
		if (typeof playerPositions[table.SBLIND.NUMBER].bet.obj != 'undefined') {
			io.rmvObj(playerPositions[table.SBLIND.NUMBER].bet.obj);
			playerPositions[table.SBLIND.NUMBER].bet.obj = undefined;
		}
		if (typeof playerPositions[table.SBLIND.NUMBER].chips.obj != 'undefined') {
			var sblind = parseFloat(playerPositions[table.SBLIND.NUMBER].chips.obj.chips)
					+ parseFloat(table.SBLIND.CHIPS);
			playerPositions[table.SBLIND.NUMBER].chips.obj.chips = sblind;
			playerPositions[table.SBLIND.NUMBER].chips.obj.setText(recordHelper
					.chipsFormat(sblind));
		}

		if (typeof playerPositions[table.BBLIND.NUMBER].bet.objBG != 'undefined') {
			io.rmvObj(playerPositions[table.BBLIND.NUMBER].bet.objBG);
			playerPositions[table.BBLIND.NUMBER].bet.objBG = undefined;
		}

		if (typeof playerPositions[table.BBLIND.NUMBER].bet.obj != 'undefined') {
			io.rmvObj(playerPositions[table.BBLIND.NUMBER].bet.obj);
			playerPositions[table.BBLIND.NUMBER].bet.obj = undefined;
		}

		if (typeof playerPositions[table.BBLIND.NUMBER].chips.obj != 'undefined') {
			var bblind = parseFloat(playerPositions[table.BBLIND.NUMBER].chips.obj.chips)
					+ parseFloat(table.BBLIND.CHIPS);
			playerPositions[table.BBLIND.NUMBER].chips.obj.chips = bblind;
			playerPositions[table.BBLIND.NUMBER].chips.obj.setText(recordHelper
					.chipsFormat(bblind));
		}
	}

	function betShowWithoutMinus(pos, money) {
		if (typeof playerPositions[pos].bet.obj == 'undefined') {
			playerPositions[pos].bet.objBG = new iio.SimpleRect(
					playerPositions[pos].bet.x, playerPositions[pos].bet.y,
					betBgScale.x, betBgScale.y).addImage('http://upyun.pokermate.net/handplayer/res/chips.png',
					function() {
						// recordHelper.soundPlay('chipThrow');
						io.addToGroup('table', playerPositions[pos].bet.objBG);

					});
			playerPositions[pos].bet.obj = new iio.Text(recordHelper
					.chipsFormat(money), playerPositions[pos].bet.x + 8,
					playerPositions[pos].bet.y + 8).setFont('24px Myriad Pro')
					.setTextAlign('center').setFillStyle('white'); // 筹码出
			io.addToGroup('table4', playerPositions[pos].bet.obj, 4);
			playerPositions[pos].bet.obj.chips = parseFloat(money);
		} else {
			var totalmoney = parseFloat(playerPositions[pos].bet.obj.chips)
					+ parseFloat(money);
			playerPositions[pos].bet.obj.chips = totalmoney;
			playerPositions[pos].bet.obj.setText(recordHelper
					.chipsFormat(totalmoney));
		}
	}

	function betShow(pos, money) {
		// if (typeof playerPositions[pos].bet.obj == 'undefined') {
		// playerPositions[pos].bet.objBG = new
		// iio.SimpleRect(playerPositions[pos].bet.x,playerPositions[pos].bet.y,betBgScale.x,betBgScale.y)
		// .addImage('http://upyun.pokermate.net/handplayer/res/chips.png',function(){
		// //recordHelper.soundPlay('chipThrow');
		// io.addToGroup('table',playerPositions[pos].bet.objBG);
		//
		// });
		// playerPositions[pos].bet.obj = new
		// iio.Text(recordHelper.chipsFormat(money),
		// playerPositions[pos].bet.x+8,playerPositions[pos].bet.y+8)
		// .setFont('24px Myriad Pro')
		// .setTextAlign('center')
		// .setFillStyle('white'); // 筹码出
		// io.addToGroup('table4', playerPositions[pos].bet.obj,4);
		// playerPositions[pos].bet.obj.chips = parseFloat(money);
		// }
		// else {
		// var totalmoney = parseFloat(playerPositions[pos].bet.obj.chips) +
		// parseFloat(money);
		// playerPositions[pos].bet.obj.chips = totalmoney;
		// playerPositions[pos].bet.obj.setText(recordHelper.chipsFormat(totalmoney));
		// }
		betShowWithoutMinus(pos, money);
		if (typeof playerPositions[pos].chips.obj != 'undefined') {

			var temp = parseFloat(playerPositions[pos].chips.obj.chips)
					- parseFloat(money);
			// if(parseFloat(playerPositions[pos].chips.obj.chips)==parsFloat(950))
			// {
			// alert(playerPositions[pos].chips.obj.chips);
			// alert(money);
			// alert(temp);
			// alert(recordHelper.chipsFormat(temp));
			// }
			playerPositions[pos].chips.obj.chips = temp;
			playerPositions[pos].chips.obj.setText(recordHelper
					.chipsFormat(temp));
		}
	}

	function blindShow(callback) { // 盲注展示

		recordHelper.echo('************');

		betShow(table.SBLIND.NUMBER, table.SBLIND.CHIPS);
		betShow(table.BBLIND.NUMBER, table.BBLIND.CHIPS);

		if (callback) {
			callback();
		}
	}

	function holecardShowUndo() {
		bubbleClear();
		var holecard = pokercard.HOLECARD;
		if (typeof holecard.length == 'undefined') {
			holecard = [ holecard ];
		}
		for (var i = 1; i < playerPositions.length; i++) {
			for (var j = 0; j < 2; j++) {
				if (typeof playerPositions[i].holecard[j].obj != 'undefined'
						&& typeof playerPositions[i].chips.obj != 'undefined') {
					io.rmvObj(playerPositions[i].holecard[j].obj);
					playerPositions[i].holecard[j].obj = undefined;
				}
			}
		}
		;
	}

	function holecardShow(callback) { // 底牌展示

		var holecard = pokercard.HOLECARD;
		if (typeof holecard.length == 'undefined') {
			holecard = [ holecard ];
		}
		for (var i = 0; i < holecard.length; i++) {
			// recordHelper.echo('<br/>');

			var cards = holecard[i].CARD.split(' ');
			// 判断收藏者是否在牌局中
			if (cards[0] != '-1') {
				(function(pos) {
					playerPositions[holecard[i].NUMBER].holecard[0].obj = new iio.SimpleRect(
							playerPositions[holecard[i].NUMBER].holecard[0],
							cardScaleSmall.x, cardScaleSmall.y)
					// .setAlpha(0)
					// .fadeIn(.02)
					.addImage('http://upyun.pokermate.net/handplayer/res/' + cards[0] + '_small.png', function() {
						io.addToGroup('table5',
								playerPositions[pos].holecard[0].obj, 5);

					}); // 底牌2
					playerPositions[pos].holecard[1].obj = new iio.SimpleRect(
							playerPositions[pos].holecard[1], cardScaleSmall.x,
							cardScaleSmall.y)
					// .setAlpha(0)
					// .fadeIn(.02)
					.addImage('http://upyun.pokermate.net/handplayer/res/' + cards[1] + '_small.png', function() {
						io.addToGroup('table7',
								playerPositions[pos].holecard[1].obj, 7);
					}); // 底牌1
					playerPositions[holecard[i].NUMBER].holecard[0].obj.shown = true;

				})(holecard[i].NUMBER);
			}
		}
		for (var i = 1; i < playerPositions.length; i++) {
			if (typeof playerPositions[i].holecard[1].obj == 'undefined'
					&& typeof playerPositions[i].chips.obj != 'undefined') {
				(function(pos) {
					playerPositions[pos].holecard[0].obj = new iio.SimpleRect(
							playerPositions[pos].holecard[0], cardScaleSmall.x,
							cardScaleSmall.y)
					// .setAlpha(0)
					// .fadeIn(.02)
					.addImage('http://upyun.pokermate.net/handplayer/res/closecardsingle_small.png', function() {
						io.addToGroup('table5',
								playerPositions[pos].holecard[0].obj, 5);

					}); // 底牌2
					playerPositions[pos].holecard[1].obj = new iio.SimpleRect(
							playerPositions[pos].holecard[1], cardScaleSmall.x,
							cardScaleSmall.y)
					// .setAlpha(0)
					// .fadeIn(.02)
					.addImage('http://upyun.pokermate.net/handplayer/res/closecardsingle_small.png', function() {
						io.addToGroup('table7',
								playerPositions[pos].holecard[1].obj, 7);
					}); // 底牌1

				})(i);

			}
		}
		;
		if (callback) {
			callback();
		}
	}

	function preFlopShowUndo() {
		bubbleClear();
	}

	function preFlopShow(callback) { // preflop阶段下注
		var players = pokercard.PREFLOP.PLAYER;
		bubbleClear();
		// bet(players);

		if (callback) {
			callback();
		}
	}

	function flopShowUndo() {
		bubbleClear();
		for (var i = 0; i < 3; i++) {
			if (typeof boardPositions[i].obj != 'undefined') {
				io.rmvObj(boardPositions[i].obj);
				boardPositions[i].obj = undefined;
			}
		}

		flopShowInnerUndo();
	}
	function flopShowInnerUndo() {
		potPosition.obj.setText(recordHelper.chipsFormat(0));
		for (var i = 1; i < playerPositions.length; i++) {
			var totalBet = parseFloat(0);
			var playerPosition = playerPositions[i];
			var status = ' ';
			if (i == table.SBLIND.NUMBER) {
				totalBet = totalBet + parseFloat(table.SBLIND.CHIPS);
			}
			if (i == table.BBLIND.NUMBER) {
				totalBet = totalBet + parseFloat(table.BBLIND.CHIPS);
			}
			for (var j = 0; j < pokercard.PREFLOP.PLAYER.length; j++) {
				var player = pokercard.PREFLOP.PLAYER[j];// {NUMBER :
				if (player.NUMBER == i) {
					var action = actionStatus(player.ACTION);
					switch (action.status) {
					case 'raise':
					case 'call':
					case 'allin':
						totalBet = totalBet + parseFloat(action.money);
						break;
					case 'check':
					case 'fold':
						break;
					}
					status = action.status;
				}

			}
			;
			if (totalBet > 0) {
				betShowWithoutMinus(i, totalBet);
			}
			(function(pos, st) {
				drawBubbleWithoutAni(pos, st);
			})(playerPosition, status);

		}
	}

	function flopShow(callback) { // flop阶段下注
		if (pokercard.FLOP.CARD != null) {
			var players = pokercard.FLOP.PLAYER, cards = pokercard.FLOP.CARD
					.split(' '), pot = pokercard.FLOP.POT;
			bubbleClear();
			// 展示三张牌
			recordHelper.echo('--- 发翻牌 [' + recordHelper.card2str(cards[0])
					+ '-' + recordHelper.card2str(cards[1]) + '-'
					+ recordHelper.card2str(cards[2]) + '] ---');
			for (var i = 0; i < cards.length; i++) {
				(function(pos) {
					boardPositions[i].obj = new iio.SimpleRect(
							boardPositions[i], cardScale.x, cardScale.y)
							.addImage('http://upyun.pokermate.net/handplayer/res/' + cards[i] + '.png',
									function() {
										setTimeout(function() {
											io.addToGroup('table',
													boardPositions[pos].obj);
										}, 200 * pos);
									});
				})(i);
			}
			;
			// 下注
			bet2pot(pot);
		}

		if (callback) {
			callback();
		}
	}

	function turnShowUndo() {
		bubbleClear();
		if (typeof boardPositions[3].obj != 'undefined') {
			io.rmvObj(boardPositions[3].obj);
			boardPositions[3].obj = undefined;
		}
		turnShowInnerUndo();
	}

	function turnShowInnerUndo() {
		if (pokercard.FLOP.POT)
			potPosition.obj.setText(recordHelper
					.chipsFormat(pokercard.FLOP.POT));
		for (var i = 1; i < playerPositions.length; i++) {
			var totalBet = parseFloat(0);
			var playerPosition = playerPositions[i];
			var status = ' ';
			for (var j = 0; j < pokercard.FLOP.PLAYER.length; j++) {
				var player = pokercard.FLOP.PLAYER[j];// {NUMBER :
				if (player.NUMBER == i) {
					var action = actionStatus(player.ACTION);
					switch (action.status) {
					case 'raise':
					case 'call':
					case 'allin':
						totalBet = totalBet + parseFloat(action.money);
						break;
					case 'check':
					case 'fold':
						break;
					}
					status = action.status;
				}

			}
			;
			if (totalBet > 0) {
				betShowWithoutMinus(i, totalBet);
				// break;
			}
			(function(pos, st) {
				drawBubbleWithoutAni(pos, st);
			})(playerPosition, status);

		}
	}

	function turnShow(callback) {
		if (pokercard.TURN.CARD != null) {
			var players = pokercard.TURN.PLAYER, card = pokercard.TURN.CARD
					.trim(), pot = pokercard.TURN.POT;
			bubbleClear();
			// 展示第四张牌
			recordHelper.echo('--- 发转牌 [' + recordHelper.card2str(card)
					+ '] ---');
			boardPositions[3].obj = new iio.SimpleRect(boardPositions[3],
					cardScale.x, cardScale.y).addImage('http://upyun.pokermate.net/handplayer/res/' + card
					+ '.png', function() {
				io.addToGroup('table', boardPositions[3].obj);
			});
			// 下注
			bet2pot(pot);
			// bet(players);
		}
		if (callback) {
			callback();
		}
	}

	function riverShowUndo() {
		bubbleClear();
		if (typeof boardPositions[4].obj != 'undefined') {
			io.rmvObj(boardPositions[4].obj);
			boardPositions[4].obj = undefined;
		}

		rivershowInnerUndo();
		// for (var j = 0; j < pokercard.TURN.PLAYER.length; j++) {
		// var player = pokercard.TURN.PLAYER[j];// {NUMBER :
		// playerPositions[player.NUMBER].action = actionStatus(player.ACTION);
		//
		// if (player.NUMBER == i) {
		// var action = actionStatus(player.ACTION);
		// switch (action.status) {
		// case 'raise':
		// case 'call':
		// case 'allin':
		// playerPositions[player.NUMBER].totalBet =
		// playerPositions[player.NUMBER].totalBet
		// + parseFloat(action.money);
		// break;
		// case 'check':
		// case 'fold':
		// break;
		// }
		// playerPositions[player.NUMBER].status = action.status;
		// }
		//
		// }
		// for (var i = 1; i < playerPositions.length; i++) {
		// var playerPosition = playerPositions[i];
		// if (playerPosition.totalBet > 0) {
		// betShowWithoutMinus(i, playerPosition.totalBet);
		// }
		// (function(pos, st) {
		// drawBubbleWithoutAni(pos, st);
		// })(playerPosition, playerPosition.status);
		//
		// }
	}
	function rivershowInnerUndo() {
		if (pokercard.TURN.POT)
			potPosition.obj.setText(recordHelper
					.chipsFormat(pokercard.TURN.POT));
		for (var i = 1; i < playerPositions.length; i++) {
			var totalBet = parseFloat(0);
			var playerPosition = playerPositions[i];
			var status = ' ';
			for (var j = 0; j < pokercard.TURN.PLAYER.length; j++) {
				var player = pokercard.TURN.PLAYER[j];// {NUMBER :
				if (player.NUMBER == i) {
					var action = actionStatus(player.ACTION);
					switch (action.status) {
					case 'raise':
					case 'call':
					case 'allin':
						totalBet = totalBet + parseFloat(action.money);
						break;
					case 'check':
					case 'fold':
						break;
					}
					status = action.status;
				}

			}
			if (totalBet > 0) {
				betShowWithoutMinus(i, totalBet);
			}
			(function(pos, st) {
				drawBubbleWithoutAni(pos, st);
			})(playerPosition, status);

		}
	}

	function riverShow(callback) {
		if (pokercard.RIVER.CARD != null) {
			var players = pokercard.RIVER.PLAYER, card = pokercard.RIVER.CARD
					.trim(), pot = pokercard.RIVER.POT;
			bubbleClear();
			// 展示第五张牌
			recordHelper.echo('--- 发河牌 [' + recordHelper.card2str(card)
					+ '] ---');
			boardPositions[4].obj = new iio.SimpleRect(boardPositions[4],
					cardScale.x, cardScale.y).addImage('http://upyun.pokermate.net/handplayer/res/' + card
					+ '.png', function() {
				io.addToGroup('table', boardPositions[4].obj);
			});
			// 下注
			bet2pot(pot);
			// bet(players);
		}
		if (callback) {
			callback();
		}
	}

	function showDownUndo() {
		bubbleClear();
		if (pokercard.RIVER) {
			rivershowInnerUndo();
		} else if (pokercard.TURN) {
			turnShowInnerUndo();
		} else if (pokercard.FLOP) {
			flopShowInnerUndo();
		} else {
			potPosition.obj.setText(recordHelper.chipsFormat(0));
		}

		var players = record.STAGE.SHOWDOWN.PLAYER;
		if (Object.prototype.toString.call(players) !== '[object Array]') {
			players = [ players ];
		}
		var holecard = pokercard.HOLECARD;
		if (typeof holecard.length == 'undefined') {
			holecard = [ holecard ];
		}
		for (var i = 0; i < players.length; i++) {
			if (typeof playerPositions[players[i].NUMBER].holecard[0].obj != 'undefined') { // 亮底牌
				// 取消显示牌型
				if (typeof playerPositions[players[i].NUMBER].pattern.objBG != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].pattern.objBG);
					playerPositions[players[i].NUMBER].pattern.objBG = undefined;
				}
				if (typeof playerPositions[players[i].NUMBER].pattern.obj != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].pattern.obj);
					playerPositions[players[i].NUMBER].pattern.obj = undefined;
				}
				// 删除王冠
				if (typeof playerPositions[players[i].NUMBER].bet.objBG != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].bet.objBG);
					playerPositions[players[i].NUMBER].bet.objBG = undefined;
				}
				if (typeof playerPositions[players[i].NUMBER].bet.obj != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].bet.obj);
					playerPositions[players[i].NUMBER].bet.obj = undefined;
				}
				// 删除win标志
				if (typeof playerPositions[players[i].NUMBER].win.objBG != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].win.objBG);
					playerPositions[players[i].NUMBER].win.objBG = undefined;
				}
				if (typeof playerPositions[players[i].NUMBER].win.obj != 'undefined') {
					io.rmvObj(playerPositions[players[i].NUMBER].win.obj);
					playerPositions[players[i].NUMBER].win.obj = undefined;
				}

				// 判断是否是刚刚展示的手牌，由于发现不是刚刚显示的手牌会continue，所以应该放在最后
				var newShow = true;
				for (var j = 0; j < holecard.length; j++) {
					// if(players[i].NUMBER] == holecard[j].NUMBER)
					// alert('hehe');
					// alert('i = ' + i + ' j = ' +j);
					if ((players[i].NUMBER) == (holecard[j].NUMBER))
						newShow = false;
				}
				if (!newShow)
					continue;
				io.rmvObj(playerPositions[players[i].NUMBER].holecard[0].obj);
				playerPositions[players[i].NUMBER].holecard[0].obj = undefined;

				if (typeof playerPositions[players[i].NUMBER].holecard[1].obj != 'undefined') {
					io
							.rmvObj(playerPositions[players[i].NUMBER].holecard[1].obj);
					playerPositions[players[i].NUMBER].holecard[1].obj = undefined;
				}
				if (typeof playerPositions[players[i].NUMBER].chips.obj != 'undefined') {
					(function(pos) {
						playerPositions[pos].holecard[0].obj = new iio.SimpleRect(
								playerPositions[pos].holecard[0],
								cardScaleSmall.x, cardScaleSmall.y)
								.addImage(
										'http://upyun.pokermate.net/handplayer/res/closecardsingle_small.png',
										function() {
											io
													.addToGroup(
															'table5',
															playerPositions[pos].holecard[0].obj,
															5);

										}); // 底牌2
						playerPositions[pos].holecard[1].obj = new iio.SimpleRect(
								playerPositions[pos].holecard[1],
								cardScaleSmall.x, cardScaleSmall.y)
								.addImage(
										'http://upyun.pokermate.net/handplayer/res/closecardsingle_small.png',
										function() {
											io
													.addToGroup(
															'table7',
															playerPositions[pos].holecard[1].obj,
															7);
										}); // 底牌1

					})(players[i].NUMBER);

				}
			}
		}
		// for (var i = 1; i < playerPositions.length; i++) {
		// var totalBet = parseFloat(0);
		// var playerPosition = playerPositions[i];
		// var status = ' ';
		// for (var j = 0; j < pokercard.RIVER.PLAYER.length; j++) {
		// var player = pokercard.RIVER.PLAYER[j];// {NUMBER :
		// // players[i].NUMBER,
		// // NAME :
		// // players[i].NAME,
		// // ACTION :
		// // players[i].ACTION};
		// if (player.NUMBER == i) {
		// var action = actionStatus(player.ACTION);
		// switch (action.status) {
		// case 'raise':
		// case 'call':
		// case 'allin':
		// totalBet = totalBet + parseFloat(action.money);
		// break;
		// case 'check':
		// case 'fold':
		// break;
		// }
		// status = action.status;
		// }
		//
		// }
		// ;
		// if (totalBet > 0) {
		// betShowWithoutMinus(i, totalBet);
		// // break;
		// }
		// (function(pos, st) {
		// drawBubbleWithoutAni(pos, st);
		// })(playerPosition, status);
		//
		// }

	}

	function showDown() {
		// alert(1);
		bubbleClear();
		bet2pot();

		var players = record.STAGE.SHOWDOWN.PLAYER;
		recordHelper.echo('--- 亮牌 ---');
		if (Object.prototype.toString.call(players) !== '[object Array]') {
			players = [ players ];
		}
		// recordHelper.soundPlay('cardOpen');
		for (var i = 0; i < players.length; i++) {
			// recordHelper.echoHolecard(players[i]);
			var action = actionStatus(players[i].ACTION);
			if (action.status != 'noshow') {
				if (typeof playerPositions[players[i].NUMBER].holecard[0].obj.shown == 'undefined') { // 亮底牌
					var cards = players[i].CARD.split(' ');

					(function(pos) {
						// 删除背面朝上的卡牌
						if (typeof playerPositions[pos].holecard[0].obj != 'undefined') {
							io.rmvObj(playerPositions[pos].holecard[0].obj);
							playerPositions[pos].holecard[0].obj = undefined;
						}
						if (typeof playerPositions[pos].holecard[1].obj != 'undefined') {
							io.rmvObj(playerPositions[pos].holecard[1].obj);
							playerPositions[pos].holecard[1].obj = undefined;
						}
						playerPositions[pos].holecard[0].obj = new iio.SimpleRect(
								playerPositions[pos].holecard[0],
								cardScaleSmall.x, cardScaleSmall.y)
								// .setAlpha(0)
								// .fadeIn(.02)
								.addImage(
										'http://upyun.pokermate.net/handplayer/res/' + cards[0] + '_small.png',
										function() {
											io
													.addToGroup(
															'table5',
															playerPositions[pos].holecard[0].obj,
															5);

										}); // 底牌2
						playerPositions[pos].holecard[1].obj = new iio.SimpleRect(
								playerPositions[pos].holecard[1],
								cardScaleSmall.x, cardScaleSmall.y)
								// .setAlpha(0)
								// .fadeIn(.02)
								.addImage(
										'http://upyun.pokermate.net/handplayer/res/' + cards[1] + '_small.png',
										function() {
											io
													.addToGroup(
															'table7',
															playerPositions[pos].holecard[1].obj,
															7);
										}); // 底牌1

					})(players[i].NUMBER);

					// (function(pos, cards){
					// playerPositions[pos].holecard[0].obj = new
					// iio.SimpleRect(playerPositions[pos].holecard[0],
					// cardScale.x, cardScale.y)
					// // .rotate(-Math.PI/36)
					// .setAlpha(0)
					// .fadeIn(.02)
					// .addImage('http://upyun.pokermate.net/handplayer/res/'+cards[0]+'.png', function(){
					// io.addToGroup('table',playerPositions[pos].holecard[0].obj);
					// }); // 底牌1
					// if(typeof playerPositions[pos].holecard[1].obj !=
					// 'undefined') {
					// io.rmvObj(playerPositions[pos].holecard[1].obj);
					// playerPositions[pos].holecard[1].obj = undefined;
					// }
					// playerPositions[pos].holecard[1].obj = new
					// iio.SimpleRect(playerPositions[pos].holecard[1],
					// cardScale.x, cardScale.y)
					// // .rotate(Math.PI/36)
					// .setAlpha(0)
					// .fadeIn(.02)
					// .addImage('http://upyun.pokermate.net/handplayer/res/'+cards[1]+'.png', function(){
					// io.addToGroup('table',playerPositions[pos].holecard[1].obj);
					// }); // 底牌2
					// })(players[i].NUMBER,cards);
				}
			}
			// alert(4);
			// 显示牌型
			if (players[i].DESCRP) {
				playerPositions[players[i].NUMBER].pattern.objBG = new iio.SimpleRect(
						playerPositions[players[i].NUMBER].chips.x,
						playerPositions[players[i].NUMBER].chips.y - 8, 96, 32)
						.setFillStyle('yellow');
				io.addToGroup('table',
						playerPositions[players[i].NUMBER].pattern.objBG);

				playerPositions[players[i].NUMBER].pattern.obj = new iio.Text(
						players[i].DESCRP,
						playerPositions[players[i].NUMBER].chips).setFont(
						'24px Microsoft YaHei').setTextAlign('center')
						.setFillStyle('black');
				io.addToGroup('table',
						playerPositions[players[i].NUMBER].pattern.obj);
			}
			// 展示所赢筹码
			// alert(5);
			if (typeof players[i].ACTION != 'undefined') {
				(function(pos) {
					// recordHelper.echoTest(action.status);
					// recordHelper.echoTest(action.status == 'win'||
					// action.status == 'noshow');
					// if (action.status == 'win' || action.status == 'noshow')
					// {
					if (Number(action.money) > 0) {
						// if (typeof playerPosition.bubble.obj == 'undefined')
						// {
						// playerPosition.bubble.obj = new
						// iio.SimpleRect(playerPosition.bubble,
						// bubbleScale.x,bubbleScale.y)
						// .setPos(playerPosition.bubble.x,playerPosition.bubble.y
						// + 20)
						// .addImage('http://upyun.pokermate.net/handplayer/res/'+bubbleName+'.png',function(){
						// io.addToGroup('table10',playerPosition.bubble.obj,10);
						// })
						// .enableUpdates(function(obj,dt,player){
						// if(obj.pos.y < player[1]){
						// obj.pos.y = player[1];
						// // alert(player[2]);
						// }else if (obj.pos.y > player[1]){
						// obj.pos.y -= .8;
						// }
						// return true;
						// },[0,playerPosition.bubble.y]); // 气泡
						// } else{
						// playerPosition.bubble.obj
						// .addImage('http://upyun.pokermate.net/handplayer/res/'+bubbleName+'.png')
						// .setPos(playerPosition.bubble.x,playerPosition.bubble.y
						// + 20)
						// .enableUpdates(function(obj,player){
						// if(obj.pos.y < player[1]){
						// obj.pos.y = player[1];
						// }else if (obj.pos.y > player[1]){
						// obj.pos.y -= .8;
						// }
						// return true;
						// },[0,playerPosition.bubble.y]);
						// }

						playerPositions[players[i].NUMBER].win.objBG = new iio.SimpleRect(
								playerPositions[players[i].NUMBER].win.x,
								playerPositions[players[i].NUMBER].win.y + 20,
								bubbleScale.x, bubbleScale.y)
								.addImage(
										'http://upyun.pokermate.net/handplayer/res/win.png',
										function() {
											io
													.addToGroup(
															'table10',
															playerPositions[pos].win.objBG,
															10);

										})
								.enableUpdates(
										function(obj, dt, player) {
											// alert('1-'+obj.pos.y);
											// alert('2-'+dt);
											// alert('3-'+player[1]);
											if (obj.pos.y < player[1]) {
												obj.pos.y = player[1];
												// alert(player[2]);
											} else if (obj.pos.y > player[1]) {
												obj.pos.y -= .8;
											}
											return true;
										},
										[
												0,
												playerPositions[players[i].NUMBER].win.y ]); // 气泡
						playerPositions[players[i].NUMBER].win.obj = new iio.Text(
								action.money,
								playerPositions[players[i].NUMBER].win.x,
								playerPositions[players[i].NUMBER].win.y + 40)
								.setFont('23px Myriad Pro')
								.setTextAlign('center')
								.setFillStyle('white')
								.enableUpdates(
										function(obj, dt, player) {
											// alert('1-'+obj.pos.y);
											// alert('2-'+dt);
											// alert('3-'+player[1]);
											if (obj.pos.y < player[1]) {
												obj.pos.y = player[1];
												// alert(player[2]);
											} else if (obj.pos.y > player[1]) {
												obj.pos.y -= .8;
											}
											return true;
										},
										[
												0,
												playerPositions[players[i].NUMBER].win.y + 20 ]); // 气泡
						io.addToGroup('table11', playerPositions[pos].win.obj,
								11);
					}
					// //筹码位置加皇冠
					// playerPositions[players[i].NUMBER].bet.objBG = new
					// iio.SimpleRect(playerPositions[players[i].NUMBER].bet.x,playerPositions[players[i].NUMBER].bet.y
					// - 45,50,40)
					// .setAlpha(0)
					// .fadeIn(.2)
					// .addImage('http://upyun.pokermate.net/handplayer/res/crown.png',function(){
					// io.addToGroup('table',playerPositions[pos].bet.objBG);
					// });
					// //筹码位置显示赢取的筹码
					// playerPositions[players[i].NUMBER].bet.obj = new
					// iio.Text(action.money,
					// playerPositions[players[i].NUMBER].bet)
					// .setFont('24px Microsoft YaHei')
					// .setTextAlign('center')
					// .setFillStyle('white');
					// io.addToGroup('table',playerPositions[players[i].NUMBER].bet.obj);
					// }
					// else { //如果输了但是获得金钱大于0，则也显示获得的筹码
					if (action.money > 0) {
						(function(pos) {
							playerPositions[players[i].NUMBER].bet.objBG = new iio.SimpleRect(
									playerPositions[players[i].NUMBER].bet.x,
									playerPositions[players[i].NUMBER].bet.y,
									betBgScale.x, betBgScale.y)
									.addImage(
											'http://upyun.pokermate.net/handplayer/res/chips.png',
											function() {
												io
														.addToGroup(
																'table',
																playerPositions[pos].bet.objBG);
											});
						})(players[i].NUMBER);

						// 筹码位置显示获得的筹码
						playerPositions[players[i].NUMBER].bet.obj = new iio.Text(
								action.money,
								playerPositions[players[i].NUMBER].bet.x + 8,
								playerPositions[players[i].NUMBER].bet.y + 8)
								.setFont('24px Myriad Pro').setTextAlign(
										'center').setFillStyle('white');
						io.addToGroup('table4',
								playerPositions[players[i].NUMBER].bet.obj, 4);
					}

					//                

				})(players[i].NUMBER);
			}

			// 清空奖池
			// io.rmvObj(potPosition.obj);
			potPosition.obj.text = 0;
			// alert(3);

		}
		;
		// recordHelper.echo('--- 得分 ---');
		// for (var i = 0; i < players.length; i++) {
		// if (typeof players[i].ACTION != 'undefined') {
		// recordHelper.echo(players[i].NAME + '【' + players[i].DESCRP + '】 赢得 '
		// + players[i].ACTION) + '$';
		// }
		// };
	}

	function actionStatus(action) { // call 2 to 4 raise 2 to 4 fold
		var parseStr = action.toLowerCase().split(' '), ret = {};
		ret.status = parseStr[0];
		if (parseStr[1]) {
			ret.money = parseStr[1];
		}
		// console.log(ret);
		return ret; // {status: 'raise',money:10}
	}

	function bet(players) { // 玩家下注
		if (players) {
			for (var i = 0; i < players.length; i++) {
				var player = players[i];// {NUMBER : players[i].NUMBER, NAME :
				// players[i].NAME, ACTION :
				// players[i].ACTION};
				timeControl.add({
					fn : execute,
					param : player,
					during : recordHelper.interval.bet,
					undoFn : executeUndo
				});
			}
			;
		}
	}

	function executeUndo(player) {
		var playerPosition = playerPositions[player.NUMBER];
		var action = actionStatus(player.ACTION);
		bubbleClearOne(player.NUMBER);
		switch (action.status) {
		case 'raise':
		case 'call':
		case 'allin':

			// plus chips
			if (typeof playerPosition.chips.obj != 'undefined') {
				var mchips = parseFloat(playerPosition.chips.obj.chips)
						+ parseFloat(action.money);
				playerPosition.chips.obj.chips = mchips;
				playerPosition.chips.obj.setText(recordHelper
						.chipsFormat(mchips));
			}

			// minus bet
			// alert('executeUndo player '+ (typeof playerPosition.bet.obj ==
			// 'undefined'));
			if (typeof playerPosition.bet.obj != 'undefined') {
				var chips = parseFloat(playerPosition.bet.obj.chips)
						- parseFloat(action.money);
				// alert(chips);
				if (chips > 0) {
					playerPosition.bet.obj.chips = chips;
					playerPosition.bet.obj.setText(recordHelper
							.chipsFormat(chips));
				} else {
					// alert('del');
					if (typeof playerPosition.bet.obj != 'undefined') {
						io.rmvObj(playerPosition.bet.obj);
						playerPosition.bet.obj = undefined;
					}
					if (typeof playerPosition.bet.objBG != 'undefined') {
						io.rmvObj(playerPosition.bet.objBG);
						playerPosition.bet.objBG = undefined;
					}
				}
			}
			// alert('executeUndo player '+ (typeof playerPosition.bet.obj ==
			// 'undefined'));
			// alert('executeUndo player '+ (typeof playerPosition.bet.objBG ==
			// 'undefined'));
			break;
		case 'check':
			break;
		case 'fold':
			if (typeof playerPositions[player.NUMBER].holecardGray[0].obj != 'undefined') {
				io.rmvObj(playerPositions[player.NUMBER].holecardGray[0].obj);
				playerPositions[player.NUMBER].holecardGray[0].obj = undefined;
			}
			if (typeof playerPositions[player.NUMBER].holecardGray[1].obj != 'undefined') {
				io.rmvObj(playerPositions[player.NUMBER].holecardGray[1].obj);
				playerPositions[player.NUMBER].holecardGray[1].obj = undefined;
			}
			break;
		}
	}

	function drawBubbleWithAni(playerPosition, bubbleName) {
		if (typeof playerPosition.bubble.obj == 'undefined') {
			playerPosition.bubble.obj = new iio.SimpleRect(
					playerPosition.bubble, bubbleScale.x, bubbleScale.y)
					.setPos(playerPosition.bubble.x,
							playerPosition.bubble.y + 20).addImage(
							'http://upyun.pokermate.net/handplayer/res/' + bubbleName + '.png',
							function() {
								io.addToGroup('table10',
										playerPosition.bubble.obj, 10);
							}).enableUpdates(function(obj, dt, player) {
						// alert('1-'+obj.pos.y);
						// alert('2-'+dt);
						// alert('3-'+player[1]);
						if (obj.pos.y < player[1]) {
							obj.pos.y = player[1];
							// alert(player[2]);
						} else if (obj.pos.y > player[1]) {
							obj.pos.y -= .8;
						}
						return true;
					}, [ 0, playerPosition.bubble.y ]); // 气泡
		} else {
			playerPosition.bubble.obj.addImage('http://upyun.pokermate.net/handplayer/res/' + bubbleName + '.png')
					.setPos(playerPosition.bubble.x,
							playerPosition.bubble.y + 20).enableUpdates(
							function(obj, player) {
								if (obj.pos.y < player[1]) {
									obj.pos.y = player[1];
								} else if (obj.pos.y > player[1]) {
									obj.pos.y -= .8;
								}
								return true;
							}, [ 0, playerPosition.bubble.y ]);
		}
	}
	function drawBubbleWithoutAni(playerPosition, bubbleName) {
		if (typeof playerPosition.bubble.obj == 'undefined') {
			playerPosition.bubble.obj = new iio.SimpleRect(
					playerPosition.bubble, bubbleScale.x, bubbleScale.y)
					.addImage('http://upyun.pokermate.net/handplayer/res/' + bubbleName + '.png',
							function() {
								io.addToGroup('table10',
										playerPosition.bubble.obj, 10);
							}); // 气泡
		} else {
			playerPosition.bubble.obj.addImage('http://upyun.pokermate.net/handplayer/res/' + bubbleName + '.png');
		}
	}

	function execute(player) {
		recordHelper.echoBet(player);
		var playerPosition = playerPositions[player.NUMBER];
		var action = actionStatus(player.ACTION);
		switch (action.status) {
		case 'raise':
		case 'call':
		case 'allin':
			// recordHelper.soundPlay('chipThrow');
			drawBubbleWithAni(playerPosition, action.status);
			betShow(player.NUMBER, action.money);
			break;
		case 'check':
		case 'fold':
			drawBubbleWithAni(playerPosition, action.status);
			if (action.status == 'fold') {
				// alert(10);
				(function(pos) {
					playerPositions[pos].holecardGray[0].obj = new iio.SimpleRect(
							playerPositions[pos].holecardGray[0],
							cardScaleSmall.x, cardScaleSmall.y)
							.addImage(
									'http://upyun.pokermate.net/handplayer/res/cardGray_small.png',
									function() {
										io
												.addToGroup(
														'table6',
														playerPositions[pos].holecardGray[0].obj,
														6);

									}); // 底牌2
					playerPositions[pos].holecardGray[1].obj = new iio.SimpleRect(
							playerPositions[pos].holecardGray[1],
							cardScaleSmall.x, cardScaleSmall.y)
							.addImage(
									'http://upyun.pokermate.net/handplayer/res/cardGray_small.png',
									function() {
										io
												.addToGroup(
														'table8',
														playerPositions[pos].holecardGray[1].obj,
														8);
									}); // 底牌1
				})(player.NUMBER);

				// playerPosition.holecardGray[0].obj = new
				// iio.SimpleRect(playerPosition.holecardGray[0], cardScale.x,
				// cardScale.y)
				// .addImage('http://upyun.pokermate.net/handplayer/res/cardGray.png', function(){
				// io.addToGroup('table6',playerPosition.holecard[0].obj,6);
				// }); // 底牌2
				// playerPosition.holecardGray[1].obj = new
				// iio.SimpleRect(playerPosition.holecardGray[1], cardScale.x,
				// cardScale.y)
				// .addImage('http://upyun.pokermate.net/handplayer/res/cardGray.png', function(){
				// io.addToGroup('table8',playerPosition.holecard[1].obj,8);
				// }); // 底牌1
				// alert(20);
				// recordHelper.soundPlay('playerFold');
			} else {
				// recordHelper.soundPlay('playerCheck');
			}
			break;
		}
	}

	function bubbleClear() { // 清空气泡
		for (var i = 0; i < seats.length; i++) {
			bubbleClearOne(seats[i].NUMBER);
		}
		;
	}

	function bubbleClearOne(pos) {
		if (typeof playerPositions[pos].bubble.obj != 'undefined') {
			io.rmvObj(playerPositions[pos].bubble.obj);
			playerPositions[pos].bubble.obj = undefined;
		}
	}

	function bet2pot(given) { // 收集玩家下注到奖池
		var pot = parseFloat(potPosition.obj.chips);
		for (var i = 0; i < seats.length; i++) {
			if (typeof playerPositions[seats[i].NUMBER].bet.obj != 'undefined') { // 注码
				pot += parseFloat(playerPositions[seats[i].NUMBER].bet.obj.chips);
				io.rmvObj(playerPositions[seats[i].NUMBER].bet.obj);
				playerPositions[seats[i].NUMBER].bet.obj = undefined;

				io.rmvObj(playerPositions[seats[i].NUMBER].bet.objBG);
				playerPositions[seats[i].NUMBER].bet.objBG = undefined;
			}
		}
		if (typeof given == 'undefined') {
			potPosition.obj.setText(recordHelper.chipsFormat(pot));
		} else {
			potPosition.obj.setText(recordHelper.chipsFormat(given));
		}
	}

	function start() {
		initTable();
		playing = true;
		needreplay = false;
		// 布局测试代码

		// showTest();

		// 运行代码

		timeControl.add({
			fn : holecardShow,
			during : recordHelper.interval.holecardShow,
			undoFn : holecardShowUndo
		});
		timeControl.add({
			fn : blindShow,
			during : recordHelper.interval.blindShow,
			undoFn : blindShowUndo
		});
		// timeControl.add({fn:preFlopShow,during:recordHelper.interval.preFlopShow,undoFn:preFlopShowUndo},
		// function(){
		// bet(pokercard.PREFLOP.PLAYER);
		// });
		bet(pokercard.PREFLOP.PLAYER);
		if (pokercard.FLOP) {
			timeControl.add({
				fn : flopShow,
				during : recordHelper.interval.flopShow,
				undoFn : flopShowUndo
			}, function() {
				bet(pokercard.FLOP.PLAYER);
			});
			if (pokercard.TURN) {
				timeControl.add({
					fn : turnShow,
					during : recordHelper.interval.turnShow,
					undoFn : turnShowUndo
				}, function() {
					bet(pokercard.TURN.PLAYER);
				});
				if (pokercard.RIVER) {
					timeControl.add({
						fn : riverShow,
						during : recordHelper.interval.riverShow,
						undoFn : riverShowUndo
					}, function() {
						bet(pokercard.RIVER.PLAYER);
					});
				}
			}
		}
		timeControl.add({
			fn : showDown,
			during : recordHelper.interval.showDown,
			undoFn : showDownUndo
		});
		if (!timeControl._pause)
			timeControl.next();
	}

	function stop() {
		needreplay = false;
		playing = false;
		io.rmvAll();
		function restorePositions(arr) {
			// 遍历playerPositions 设置 .obj = undefined;
			if (Object.prototype.toString.call(arr) === '[object Array]') {
				for (var i = 0; i < arr.length; i++) {
					console.log('array', arr[i]);
					restorePositions(arr[i]);
				}
			}
			if (Object.prototype.toString.call(arr) === '[object Object]') {
				console.log('object', arr);
				if (typeof arr.x != 'undefined'
						&& typeof arr.obj != 'undefined') {
					console.log('clear', arr);
					arr.obj = undefined;
					if (typeof arr.objBG != 'undefined') {
						arr.objBG = undefined;
					}
				} else {
					for ( var prot in arr) {
						// if (Object.prototype.toString.call(arr[i][prot]) ===
						// '[object Array]') {
						restorePositions(arr[prot]);
						// }
						// if (Object.prototype.toString.call(arr[i][prot]) ===
						// '[object Object]') {
						// ;
						// }
					}
				}
			}
		}
		restorePositions(playerPositions);
		console.log(playerPositions);
		// 删除
		timeControl._waitingAct = undefined;
		timeControl._queue.length = 0;
		timeControl._doneQueue.length = 0;
		io.draw();
	}

	function replay() {
		// if(timeControl._queue.length == 0) {

		stop();
		// if(timeControl._waitingAct) {
		// timeControl._queue.insert(0,timeControl._waitingAct);
		// timeControl._waitingAct = undefined;
		// }
		// recordHelper.echo(timeControl._doneQueue.length);
		// recordHelper.echo(timeControl._queue.length);
		// while(timeControl._doneQueue.length>0) {
		// timeControl._queue.insert(0,timeControl._doneQueue.pop());
		// // var i = 0;
		// // recordHelper.echo(i++);
		// }
		// recordHelper.echo(timeControl._doneQueue.length);
		// recordHelper.echo(timeControl._queue.length);

		start();
		// }
	}

	function testd() {
		alert('hhhhhh');
	}

	io.setFramerate(60);
	var timeControl = new Timer();
	recordHelper.start = start;
	recordHelper.stop = stop;
	recordHelper.replay = replay;
	recordHelper.forward = function() {
		timeControl.forward();
	}
	recordHelper.backward = function() {
		timeControl.backward();
	}
	recordHelper.pause = function() {
		timeControl.pause();
	};

	// testPosition();
	start();
};

var recordHelper = {
	data : {},

	interval : {
		blindShow : 5000,
		holecardShow : 5000,
		preFlopShow : 5000,
		flopShow : 5000,
		turnShow : 5000,
		riverShow : 5000,
		showDown : 5000,
		bet : 2000
	},
	infoPanl : {},
	progress_bar : {},
	chipsFormat : function(chips) {
		var chips = parseFloat(chips), ret = chips;
		if (10000 < chips && chips < 1000000) {
			chips = Math.round(chips / 1000);
			ret = chips + 'k';
		}
		if (chips > 1000000) {
			chips = Math.round(chips / 1000000);
			ret = chips + 'M';
		}
		return ret;
	},
	echoTest : function(msg) {
		this.infoPanl
				.append('<p style="font-size:28px ;font-size: 48px;color: #6c6a5e;">'
						+ msg + '</p>')
	},

	totalDur : 0,

	echo : function(msg) {
		// this.infoPanl.append('<p style="font-size:28px ;font-size:
		// 48px;color: #6c6a5e;">'+msg+'</p>')
	},
	card2str : function(card) {
		var e = card.split(''), type = '', num = '';
		switch (e[1]) {
		case 's':
			type = ' <span style="font-size:34px ; color:black;"> &spades;</span>'; // 黑桃
			break;
		case 'h':
			type = ' <span style="font-size:34px ; color:red;"> &hearts;</span>'; // 红桃
			break;
		case 'd':
			type = ' <span style="font-size:34px ; color:red;"> &diams;</span>'; // 方片
			break;
		case 'c':
			type = ' <span style="font-size:34px ; color:black;"> &clubs;</span>'; // 梅花
			break;
		}
		switch (e[0]) {
		case 'T':
			num = '10';
			break;
		case '1':
			num = 'A';
			break;
		default:
			num = e[0];
			break;
		}
		return type + num + ' ';
	},
	echoHolecard : function(holecard) {
		// var msg = holecard. NAME, cards = holecard.CARD.split(' ');
		// msg += ' 底牌: [' + this.card2str(cards[0]) + ' - ' +
		// this.card2str(cards[1]) + ']';
		// this.echo(msg);
	},
	echoBet : function(player) {
		// var msg = player.NAME, actions = player.ACTION.toLowerCase().split('
		// ');
		// switch(actions[0]) {
		// case 'call':
		// msg += ' 跟注 ' + actions[1] +'$';
		// break;
		// case 'raise':
		// msg += ' 加注 ' + actions[1] + '$';
		// break;
		// case 'allin':
		// msg += ' 全下 ';
		// break;
		// case 'check':
		// msg += ' 看牌 ';
		// break;
		// case 'fold':
		// msg += ' 弃牌 ';
		// break;
		// }
		// this.echo(msg);
	},
	nextRoundId : ' ',
	nextRound : function() {
		// alert('nextRound');
		// alert(recordHelper.nextRoundId);
		if (recordHelper.nextRoundId != ' ') {
			$.getJSON('logBasedPokerParse.php?roundid='
					+ recordHelper.nextRoundId, function(data) {
				recordHelper.data = data;
				recordHelper.stop();
				recordHelper.start();
				// iio.start(PokerPlayback,'pokerPanl');
			});
		}
	},
	sounds : {
		cardOpen : null,
		chipThrow : null,
		playerCheck : null,
		playerFold : null
	},
	soundLoad : function() {
		var that = this;
		function loadSound(o, u) {
			that.sounds[o] = new Audio();
			that.sounds[o].src = u;
			that.sounds[o].load();
			that.sounds[o].addEventListener("canplaythrough", function() {
				that.sounds[o].loaded = true;
			}, false);
		}
	},
	soundInstance : null,
	soundPlay : function(flag) {
		if (!this.soundInstance) {
			this.soundInstance = new Audio();
		}
		this.soundInstance.src = this.sounds[flag].src;
		this.soundInstance.load();
		if (this.sounds[flag] && this.sounds[flag].loaded) {
			this.soundInstance.play();
		}
	}
};

var Timer = function() {
	this._queue = [];
	this._pause = false;
	this._waitingAct = undefined;
	this._doneQueue = [];
	this._waitingIndex = 0;
	this._progressInteval = undefined;
}
Timer.prototype.pause = function() {
	// recordHelper.echoTest('pause');
	if (this._waitingAct && this._waitingAct.fn) {
		this._queue.insert(0, this._waitingAct);
		this._waitingAct = undefined;
	}
	if (this._pause) {
		this._pause = false;
		this.next(0);
	} else {
		if (typeof this._progressInteval != 'undefined') {
			clearInterval(this._progressInteval);
		}
		this._pause = true;
	}
}
Timer.prototype.add = function(action, callback) {
	// TODO 验证action包含action.fn(Function)和action.during(ms Int)
	this._queue.push(action);
	if (callback) {
		callback();
	}
}
Timer.prototype.next = function(dur) {
	this._waitingIndex++;
	var act = this._queue.shift(), that = this;
	var theIndex = this._waitingIndex;
	if (act && act.fn && act.during) {
		this._waitingAct = act;
		this.adjustProgressBar(act.during);
		setTimeout(function() {
			if (theIndex == that._waitingIndex) {
				if (that._waitingAct && that._waitingAct.fn
						&& that._waitingAct.during) {
					var temp = that._waitingAct;
					that._waitingAct = undefined;
					that._doneQueue.push(temp);
					temp.fn.call(null, temp.param);

					if (!that._pause) {
						that.next();
					}
					// else {
					// that.pause();
					// $('#icon_mask').hide();
					// $('#icon_pause').hide();
					// playing = true;
					// }
				}
			}
		}, isNaN(dur) ? act.during : dur);

	} else {
		// alert(111);
		// waitingToShowReplayMask = true;
		// setTimeout(function(){
		// if(waitingToShowReplayMask){
		// needreplay = true;
		// $('#icon_mask').show();
		// $('#icon_replay').show();
		// }
		// },1000);
		// this.pause();
		$('#icon_play').hide();
		$('#icon_pause').hide();
		$('#icon_replay').show();
	}
}
Timer.prototype.forward = function() {
	// recordHelper.echoTest('forward');
	if (this._waitingAct && this._waitingAct.fn) {
		var temp = this._waitingAct;
		this._waitingAct = undefined;
		this._doneQueue.push(temp);
		this.adjustProgressBar();
		temp.fn.call(null, temp.param);
		if (!this._pause) {
			this.next();
		}
	} else {
		var act = this._queue.shift();
		if (act) {
			if (act.fn) {
				act.fn.call(null, act.param);
				this._doneQueue.push(act);
				this.adjustProgressBar();
				if (!this._pause) {
					this.next();
				}
				// else {
				// this.pause();
				// $('#icon_mask').hide();
				// $('#icon_pause').hide();
				// playing = true;
				// }
			}
		} else {
			// alert('last ');
			// recordHelper.nextRound();
		}
	}
}
Timer.prototype.backward = function() {
	// waitingToShowReplayMask = false;
	// if(needreplay){
	// needreplay = false;
	// $('#icon_mask').hide();
	// $('#icon_replay').hide();
	// }
	if (this._waitingAct && this._waitingAct.fn) {
		this._queue.insert(0, this._waitingAct);
		this._waitingAct = undefined;
	}
	var act = this._doneQueue.pop();
	if (act && act.undoFn) {
		this._queue.insert(0, act);
		recordHelper.echo(act.undoFn.name);
		act.undoFn.call(null, act.param);
	}

	this.adjustProgressBar();

	if (!this._pause) {
		this.next();
	} else {
		// this.pause();
		// $('#icon_mask').hide();
		// $('#icon_pause').hide();
		// playing = true;
	}
}
Timer.prototype.adjustProgressBar = function(dur) { // 调整进度条的进度
	if (typeof this._progressInteval != 'undefined') {
		clearInterval(this._progressInteval);
	}
	if (typeof dur != 'undefined') { // 已知这一步的时间跨度，进度条圆滑运动
		var targetLength = dur;
		for (var i = 0; i < this._doneQueue.length; i++) {
			var act = this._doneQueue[i];
			if (act.during) {
				targetLength = targetLength + act.during;
			}
		}
		var totalLength = targetLength;
		for (var i = 0; i < this._queue.length; i++) {
			var act = this._queue[i];
			if (act.during) {
				totalLength = totalLength + act.during;
			}
		}
		var targetWidth = parseFloat(targetLength / totalLength * 100);
		fromWidth = parseFloat(recordHelper.progress_bar.style.width.split('%')[0]);
		var currentWidth = parseFloat(fromWidth);
		recordHelper.progress_bar.style.width = fromWidth + '%';
		this._progressInteval = setInterval(function() {
			currentWidth = currentWidth + (targetWidth - fromWidth)
					/ (dur / 100);
			if (currentWidth < targetWidth) {
				recordHelper.progress_bar.style.width = currentWidth + '%';
			} else {
				currentWidth = targetWidth;
				recordHelper.progress_bar.style.width = currentWidth + '%';
				clearInterval(this._progressInteval);
			}
		}, 100);
	} else {
		var targetLength = 0;
		for (var i = 0; i < this._doneQueue.length; i++) {
			var act = this._doneQueue[i];
			if (act.during) {
				targetLength = targetLength + act.during;
			}
		}
		var totalLength = targetLength;
		for (var i = 0; i < this._queue.length; i++) {
			var act = this._queue[i];
			if (act.during) {
				totalLength = totalLength + act.during;
			}
		}
		var targetWidth = parseFloat(targetLength / totalLength * 100);
		recordHelper.progress_bar.style.width = targetWidth + '%';
	}
}
