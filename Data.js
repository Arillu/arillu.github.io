






export const items = {
    type:{
        beds:[
            {
                id:0,
                name:"ground",
                use:function(player){player.Restore_Resource(["HP","MP","Stam"],[1,1,1]);}
            }
        ]
    }

}
export const actions = {
    nothing:function(){
        //do nothing
        console.log("doing nothing");
    },
    sleep:function(player, bed_id, location_id){
        items.bed.type.beds[bed_id].use(player);
    }

}

export const locations = {
    MoveTo:function(player, location){
        //disable current action
        player.Current_Location = location;
    },
    EnterCombat:function(){

    },
    OpenShop:function(){

    },
    Areas:{
        "spawn_starting_building":{
            "top_text":"Unknown: Oh! you finally woke up.",
            get_unlocked_options:function(){
                //use later for locked options
                return this.options
            },
            "options":[
                {
                    "text":'<span style="color: red;">[Exit]</span> leave the building',
                    "id":0,
                    click:(player) => locations.MoveTo(player,"spawn_outdoors")
                }

            ]
        },
        "spawn_outdoors":{
            "top_text":"You can see a large mountain, there are a few buildings, and a large wall connecting to the mountain",
            get_unlocked_options:function(){
                //use later for locked options
                return this.options
            },
            "options":[
                {
                    "text":'<span style="color: red;">[Enter]</span> Enter the building',
                    "id":0,
                    click:(player) => locations.MoveTo(player,"spawn_starting_building")
                }
            ]            
        }
    }
}