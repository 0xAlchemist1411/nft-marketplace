import { Slide } from "./Slide";
import { Horseverse } from "./Horseverse";
import { Games } from "./Games";
import { Metahorse } from "./Metahorse";
import { Dao } from "./Dao";
import { Legendary } from "./Legendary";
import { Munityprog } from "./Munityprog";
import { Art } from "./Art";
import { Partners } from "./Partners";
import { Horseversenew } from "./Horseversenew";
import { Munityadd } from "./Munityadd";
import { DataFeed } from "./DataFeed";

export const Content = () => {
    return (
        <div className="stakeContent">
            {/* <div class="example__demo example__demo--radial-gradient">

            </div> */}
            <Slide />
            <DataFeed />
            <Horseverse />
            <Games />
            <Metahorse />
            <Horseversenew />
            <Dao />
            <Legendary />
            <Munityprog />
            <Art />
            <Partners />
            <Munityadd />
        </div>
    );
};
