/**
 * 火焰山场景
 */
var HuoYanShanLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        if (bgVolume)
        {
            //播放背景音乐
            cc.audioEngine.playMusic(res.sound005_mp3, true);
        }
        else
        {
            //停止播放背景音乐
            cc.audioEngine.stopMusic(res.sound005_mp3);
        }

        //初始化数据
        this.initData();

        addBackground(this, res.bg04_png);

        //添加地图
        addMap(this, "huoyanshan");

        //添加按钮
        addButton(this);

        loadCocosStudio(this);

        getNodeInfo(this);

        setData();

        addPlayer(this, "wkshou02.png", cc.p(440, 410));

        addGunLun(this, cc.p(400, 370));

        createClipNode(this);

        addShengZi(cc.p(395, 360));

        addTouch(this);

        //创建定时器,用于播放倒计时动画
        this.schedule(this.playStartGameAnimation, 0.5);

        this.scheduleUpdate();

        return true;
    },

    update:function(dt)
    {
        sumShengZiMinPoint();
        isOutofWindows(this);
        collisionItem(this);
    },

    //创建游戏角色拉绳子时的动画
    createPlayerAnimation:function()
    {
        var animation = new cc.Animation();

        //用一个队列保存所有精灵帧对象
        for (var i = 2; i <= 7; i++)
        {
            //从精灵帧缓存池中读取精灵帧对象
            frame = spriteFrameCache.getSpriteFrame("wkshou0" + i + ".png")
            animation.addSpriteFrame(frame);
        }

        animation.setDelayPerUnit(0.1);

        //将动画包装成一个动作
        playerAnimate = cc.animate(animation);

        var sp = new cc.Spawn(
            cc.callFunc(this.playShengziMusic, this),
            playerAnimate
        );

        repShengzi = new cc.RepeatForever(sp);

        player.runAction(repShengzi);
    },

    //播放拉绳子时的音效
    playShengziMusic:function()
    {
        if (effVolume)
        {
            cc.audioEngine.playEffect(res.sound014_mp3);
        }
    },

    //移除挂在钩子上的矿石
    removeMineral:function(sprite)
    {
        sprite.removeFromParent();

        if (anchorY <= 0.05)
        {
            var mineral = gouzi.getChildByTag(1);

            if (mineral)
            {
                //计算游戏得分
                numScore += arrayScore[mineral.type];

                //显示游戏得分
                labelScore.setString(numScore + " / " + airmScore);

                //显示得分进度
                var progress = numScore / airmScore * 100;
                progressScore.setPercent(progress);

                //移除宝石
                mineral.removeFromParent();

                //标记可以触摸屏幕
                isTouch = true;

                //绳子左右摇摆
                this.schedule(playShengZiAction, 0.01);
            }
        }
    },

    //缩短绳子
    shortenRope : function()
    {
        if (anchorY <= 0.05)
        {
            //绳子停止缩短
            this.unschedule(this.shortenRope);

            //标记钩子上没有抓住矿石
            isGouzi = false;

            //停止播放拉绳子时的动画
            player.stopAction(repShengzi);
            repShengzi = null;

            //isOutofWindows函数的调用次数重置为0次
            time = 0;

            var mineral = gouzi.getChildByTag(1);

            //如果钩子上勾到了矿石
            if (mineral)
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound008_mp3);
                }

                //播放抓住矿石时的动画
                playGrabAnimation(this);

                //创建加分动画
                createAddScoreAnimation(this);
            }
            //如果钩子没有勾到矿石
            else
            {
                isTouch = true;

                //绳子左右摇摆
                this.schedule(playShengZiAction, 0.01);
            }
        }

        anchorY -= 0.01;
        shengzi.setAnchorPoint(cc.p(anchorX, anchorY));
    },

    //定时器回调函数,用于播放开始游戏时的动画
    playStartGameAnimation:function()
    {
        animationIndex += 1;

        if (animationIndex == 3)
        {
            //播放展示开始动画时的音效
            if (effVolume == 1)
            {
                cc.audioEngine.playEffect(res.sound083_mp3);
            }
        }
        else
        {
            //播放展示(3, 2, 1)的演示动画时的音效
            if (effVolume == 1)
            {
                cc.audioEngine.playEffect(res.sound082_mp3);
            }
        }

        var sprite = new cc.Sprite(arrayAnimation[animationIndex]);
        sprite.anchorX = 0.5;
        sprite.anchorY = 0.5;
        sprite.x = width / 2;
        sprite.y = height / 2;
        moveNode(sprite, cc.p(0, 40));
        sprite.scale = 0;
        sprite.opacity = 0;
        this.addChild(sprite);

        //缩放动作和淡入动作同时执行
        var sp = new cc.Spawn(
            new cc.ScaleTo(0.5, 1),
            new cc.FadeIn(0.5)
        );

        //先执行Spawn,再执行CallFunc::create
        var seq  = cc.sequence(
            sp,
            cc.callFunc(this.RemoveTimeAnimation, this, sprite)
        );

        sprite.runAction(seq);
    },

    //移除倒计时动画
    RemoveTimeAnimation:function(sprite)
    {
        sprite.removeFromParent();

        //如果播放完了倒计时动画
        if (animationIndex == 3)
        {
            animationIndex = -1;

            //关闭定时器
            this.unschedule(this.playStartGameAnimation);

            //开始游戏
            this.startGame();
        }
    },

    //开始游戏
    startGame:function()
    {
        //标记能触摸屏幕
        isTouch = true;

        //标记能点击返回按钮
        isClick = true;

        //创建定时器,用于刷新游戏时间
        this.schedule(this.updateGameTime, 1);

        //创建定时器,用于实现绳子左右摇摆
        this.schedule(playShengZiAction, 0.01);
    },

    //刷新游戏时间
    updateGameTime:function()
    {
        numTime--;
        labelTime.setString(numTime);

        //还剩5秒时,播放游戏快要结束时的警告动画
        if (numTime >= 1 && numTime <= 5)
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound030_mp3);
            }

            //播放游戏快要结束时的提示动画
            playWarningAnimation(this);
        }

        //如果游戏结束
        if (numTime <= 0)
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound029_mp3);
            }

            //标记不能再触摸了
            isTouch = false;

            //标记不能点击暂停按钮
            isClick = false;

            //显示半透明背景
            layerColor.visible = true;

            //绳子停止左右摇摆
            this.unschedule(playShengZiAction);

            //绳子停止升长
            this.unschedule(longRope);

            //绳子停止缩短
            this.unschedule(this.shortenRope);

            //停止刷新游戏时间
            this.unschedule(this.updateGameTime);

            //停止播放游戏玩家摇滚轮的动画
            if (repShengzi != null)
            {
                player.stopAction(repShengzi);
                repShengzi = null;
            }

            //树叶停止下落
            particle.removeFromParent();

            //游戏失败
            if (numScore < airmScore)
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound017_mp3);
                }

                //缩放动作和淡入动作同时执行
                var sp = new cc.Spawn(
                    new cc.ScaleTo(0.5, 1),
                    new cc.FadeIn(0.5)
                );

                //弹出游戏失败对话框后播放粒子特效
                var seq= cc.sequence(
                    sp,
                    cc.callFunc(function ()
                        {
                            //创建粒子(实现下雪的效果)
                            particle = new cc.ParticleSystem(res.xuehua_plist);
                            particle.x = width / 2;
                            particle.y = height;
                            particle.setLocalZOrder(100);
                            this.addChild(particle);
                        },
                        this)
                );

                failGameDialog.node.runAction(seq);
            }
            //游戏成功
            else
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound018_mp3);
                }

                //显示游戏得分
                var label = successGameDialog.node.getChildByName("labelScore");
                label.setString(numScore);

                //显示过关目标分
                var labelAirmScore = successGameDialog.node.getChildByName("labelAirmScore");
                labelAirmScore.setString(airmScore);

                //缩放动作和淡入动作同时执行
                var sp = new cc.Spawn(
                    new cc.ScaleTo(0.5, 1),
                    new cc.FadeIn(0.5)
                );

                //弹出游戏失败对话框后播放粒子特效
                var seq = cc.sequence(
                    sp,
                    cc.callFunc(function ()
                        {
                            //创建定时器用于展示游戏成功时的粒子特效
                            this.schedule(this.genParticle, 0.5);
                        },
                        this)
                );

                successGameDialog.node.runAction(seq);
            }
        }
    },

    //产生游戏胜利时展示的粒子特效
    genParticle:function()
    {
        var ptX = Math.random() * width;

        //创建粒子
        particle = new cc.ParticleSystem(res.yanhua_plist);
        particle.x = ptX;
        particle.y = height - 50;
        particle.setLocalZOrder(100);
        this.addChild(particle);
    },

    //初始化游戏中用到的一些数据
    initData:function()
    {
        //宝象国场景的过关目标分
        vecScore = [1350, 1920, 1930, 2215, 2430, 2445, 2450, 2525, 2950, 3030, 3215, 3400];

        animationIndex = -1;

        //设置游戏时间为60秒
        numTime = 60;

        vecMineral = [];

        //初始化时,不能触摸屏幕
        isTouch = false;

        //初始化时,不能点击返回按钮
        isClick = false;

        //初始化绳子的描点
        anchorX = 0.5;
        anchorY = 0.05;

        minX = 790;
        minY = 470;

        time = 0;

        //绳子初始化时的角度为70度
        shengziAngle = 70;

        //绳子初始化的时候向右摇摆
        isDirection = true;

        //设置游戏得分为0
        numScore = 0;

        //设置过关目标分
        airmScore = vecScore[indexLevel - 1];

        //初始化时,显示第0页的数据
        indexPage = 0;

        repShengzi = null;

        //初始化时,钩子上没有抓矿石
        isGouzi = false;

        //加载图片到精灵帧缓存池
        spriteFrameCache = cc.spriteFrameCache;
        spriteFrameCache.addSpriteFrames(res.wukong_plist, res.wukong_png);
    },

    //重玩游戏
    replayGame:function(sender, type)
    {
        switch (type)
        {
            case  ccui.Widget.TOUCH_BEGAN:
            {
                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                cc.audioEngine.stopMusic(res.sound002_mp3);

                cc.director.resume();
                cc.director.runScene(new SceneHuoYanShan());
            }
            break;
            default:
            break;
        }
    }
});

var SceneHuoYanShan = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new HuoYanShanLayer();
        this.addChild(layer);
    }
});

