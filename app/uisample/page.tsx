export default function Home() {
    return (
        <main>
            <h2>主题展示</h2>
            <div className="master-width windowlike">
                <h3>窗口标题</h3>
                <p>这个谱其实很牛逼，牛逼就牛逼在所有手感诡异的地方都是故意写得诡异的。</p>
                <p>为什么要这样写？</p>
                <p>因为蓝原椿是一个态度冷淡、有些S属性的乖僻女。但这里是直流会馆，所以所有的配色其实还是以千夏为印象的。</p>
                <div className="bipartite">
                    <div className="Button primary">我喜欢日向千夏</div>
                    <div className="Button">我喜欢蓝原椿</div>
                    <div className="Button disabled">我喜欢棍母</div>
                    <div className="Button danger">我喜欢逢坂茜（慎点）</div>
                </div>
            </div>

            <div className="master-width invwindow">
                <div className="Button escape">返回</div>
            </div>

            <div className="windowlike master-width">
                <p>喵拜想和你拼机。</p>
                <div className="bipartite">
                    <div className="Button accept">可以</div>
                    <div className="Button decline">不！！行！！</div>
                </div>
            </div>
        </main>
    );
}
