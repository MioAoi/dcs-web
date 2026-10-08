import { loadCurrentPassGara } from '@/lib/load';

export default function PassLiteCard() {
    const passGara = loadCurrentPassGara();
    return (
        <div
        className="passCard"
        style={{
            backgroundImage: `linear-gradient(#4449, #4440, #4440, #4449), url('${passGara.cropImg}')`
        }}
        >
            <div className="passName">
                <b>DCPass</b> Lite
            </div>
            <div className="passEffect">
                全日 <b><span style={{fontSize: "1.25rem"}}>9.7</span> 折</b>
            </div>
            <div className="date">
                <b>30&thinsp;d</b> 内消费 <b>&#x2265;&#xa5;300</b> 时自动持有
            </div>
        </div>
    );
}
