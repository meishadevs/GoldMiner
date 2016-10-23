//灵山场景
var LingShanLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        console.log("灵山");

        return true;
    }
});

var SceneLingShan = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new LingShanLayer();
        this.addChild(layer);
    }
});

