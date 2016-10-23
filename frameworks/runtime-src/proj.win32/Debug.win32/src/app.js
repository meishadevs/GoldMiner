
var HelloWorldLayer = cc.Layer.extend(
{

    ctor:function () {
        this._super();

        //播放背景音乐
        cc.audioEngine.playMusic(res.sound_bomb_mp3, true);
        cc.audioEngine.setMusicVolume(1);

        var mainscene = ccs.load(res. SceneMenu_json);
        this.addChild(mainscene.node);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

