export default function PassLiteCard() {
    return (
        <div
        className="passCard"
        style={{
            backgroundImage: "linear-gradient(#6669, #6660, #6660, #6669), url('/images/passlite-crop.jpg')"
        }}
        >
            <div className="passName">
                <b>DCPass</b> Lite
            </div>
            <div className="passEffect">
                全日 <b><span style={{fontSize: "1.25rem"}}>9.7</span> 折</b>
            </div>
            <div className="date">
                <b>30d</b> 内消费满 <b>&#xa5;300</b> 期间自动持有
            </div>
        </div>
    );
}
