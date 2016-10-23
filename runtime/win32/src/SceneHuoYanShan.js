//火焰山场景
var HuoYanShanLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        console.log("火焰山");

        return true;
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

