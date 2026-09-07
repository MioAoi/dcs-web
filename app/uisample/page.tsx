export default function Home() {
    return (
        <main>
            <h2>主题展示</h2>
            <div className="master-width windowlike generic-vert-grid">
                <h3>窗口标题</h3>
                <p>这个谱其实很牛逼 牛逼就牛逼在所有手感诡异的地方都是故意写得诡异的</p>
                <p>为什么要这样写？</p>
                <p>因为蓝原椿是一个态度冷淡、有些S属性的乖僻女。但这里是直流会馆，所以所有的配色其实还是以千夏为印象的。</p>
                <div className="Button primary">最主要那个按钮</div>
                <div className="Button">很普通的按钮</div>
                <div className="Button disabled">现在不能用的按钮</div>
                <div className="Button danger">不能随便按的按钮</div>
            </div>

            <div className="master-width invwindow">
                <div className="Button escape">返回</div>
            </div>
        </main>
    );
}
