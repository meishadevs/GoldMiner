/**
 *存放设置游戏动画的代码
 */

//炸弹爆炸
Boom = function(self)
{
    var boom = new cc.Sprite();
    boom.anchorX = 0.5;
    boom.anchorY = 0.5;
    moveNode(boom, cc.p(20, 15));
    gouzi.addChild(boom);

    //利用动画保存每一帧的图片
    var animation = new cc.Animation();

    for (var i = 1; i <= 6; i++)
    {
        var str = "res/texiao/baozha1/bz" + i + ".png";
        animation.addSpriteFrameWithFile(str);
    }

    //设置动画的播放速度
    animation.setDelayPerUnit(0.1);

    //将动画包装成一个动作
    var animate = new cc.Animate(animation);

    var seq = cc.sequence(
        animate,
        cc.callFunc(self.removeFromParent, boom),
        cc.callFunc(function ()
            {
                //缩短绳子
                self.schedule(self.shortenRope, 0.05);

                //播放游戏角色摇滚轮的动画
                self.createPlayerAnimation();
            },
            self)
    );

    //播放动画
    boom.runAction(seq);
}

//播放抓住矿石时的动画
playGrabAnimation = function(self)
{
    var sprite = new cc.Sprite();
    moveNode(sprite, cc.p(20, 0));
    gouzi.addChild(sprite);

    //利用动画保存每一帧的图片
    var animation = new cc.Animation();

    for (var i = 1; i <= 5; i++)
    {
        var str = "res/texiao/zhuagou/zhuagou" + i + ".png";
        animation.addSpriteFrameWithFile(str);
    }

    //设置动画的播放速度
    animation.setDelayPerUnit(0.1);
    var animate = new cc.Animate(animation);

    var seq = cc.sequence(
        animate,
        cc.callFunc(self.removeMineral, self, sprite)
    );

    //播放动画
    sprite.runAction(seq);
}

//创建加分动画
createAddScoreAnimation = function(self)
{
    var sprite = new cc.Sprite(res.add_png);
    sprite.x = width - 300;
    sprite.y = height - 200;
    moveNode(sprite, cc.p(0, 0));
    self.addChild(sprite);

    var mineral = gouzi.getChildByTag(1);

    //创建一个Atlas字体
    var label = new cc.LabelAtlas("500", res.daojushuzi_png, 25, 36, '0');
    label.anchorX = 0;
    label.anchorY = 0.5;
    moveNode(label, cc.p(25, 15));
    label.setString(arrayScore[mineral.type]);
    sprite.addChild(label);

    var seq = cc.sequence(
        new cc.MoveBy(1, cc.p(0, 100)),
        cc.callFunc(self.removeFromParent, sprite)
    );

    sprite.runAction(seq);
}

//播放游戏快要结束时的提示动画
playWarningAnimation = function(self)
{
    var sprite = new cc.Sprite();
    sprite.x = 65;
    sprite.y = height - 60;
    moveNode(sprite, cc.p(-30, 18));
    self.addChild(sprite);

    //利用动画保存每一帧的图片
    var spriteAnima = new cc.Animation();

    for(var i = 1; i <=  6; i++)
    {
        var str = "res/texiao/daoshu/daoshu" + i + ".png";

        spriteAnima.addSpriteFrameWithFile(str);
    }

    //每一帧播放的间隔
    spriteAnima.setDelayPerUnit(0.1);

    //是否回到第一帧播放
    spriteAnima.setRestoreOriginalFrame(false);

    var animate = new cc.Animate(spriteAnima);

    var seq = cc.sequence(
        animate,
        cc.callFunc(self.removeFromParent, sprite)
    );

    //播放动画
    sprite.runAction(seq);
}