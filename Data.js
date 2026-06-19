
export const items = {
    usage:{
        Eat:function(Player){
            //gain stats
            //remove 1 item
        }
    },
    itemlist:[
        {
            id:0,
            name:"old pickaxe",
            inv_sort_list:"tool",
            generic_type:"Pickaxe",
            equip_slot:"Tool",
            usage:"Equip",
            desc:"An old pickaxe",
            stats:[{t:"skill",n:"mining",v:1},
                {t:"stat",n:"str",v:1}
            ],
            tier: 0
        },
        {
            id:1,
            name:"new pickaxe",
            inv_sort_list:"tool",
            generic_type:"Pickaxe",
            equip_slot:"Tool",
            usage:"Equip",
            desc:"A new pickaxe",
            stats:[{t:"skill",n:"mining",v:2},
                {t:"stat",n:"str",v:5}
            ],
            tier: 1
        },
        {
            id:2,
            name:"Magic Rock",
            inv_sort_list:"accessory",
            generic_type:"Accessory",
            equip_slot:"Accessory",
            usage:"Equip",
            desc:"A magical rock",
            stats:[{t:"stat",n:"int",v:1}],
            tier: 0
        },
        {
            id:3,
            name:"Wood Ring",
            inv_sort_list:"accessory",
            generic_type:"Ring",
            equip_slot:"Accessory",
            usage:"Equip",
            desc:"A wooden ring",
            stats:[{t:"stat",n:"def",v:1}],
            tier: 0
        },
        {
            id:4,
            name:"Wooden Sword",
            inv_sort_list:"weapon",
            generic_type:"Sword",
            equip_slot:"Main Hand",
            usage:"Equip",
            desc:"A sword made from low quality wood",
            stats:[{t:"stat",n:"str",v:1}],
            tier: 0
        },
        {
            id:5,
            name:"Iron Sword",
            inv_sort_list:"weapon",
            generic_type:"Sword",
            equip_slot:"Main Hand",
            usage:"Equip",
            desc:"A sword made from iron",
            stats:[{t:"stat",n:"str",v:5}],
            tier: 0
        },
        {
            id:6,
            name:"Stale Bread",
            inv_sort_list:"consumable",
            generic_type:"Food",
            desc:"it's barely edible",
            tier: 0,
            usage:"Eat",
            useitem:(player)=>items.usage.Eat(player),
            stats:[{t:"buff",n:"food",v:150}]
        },
        {
            id:7,
            name:"old mat",
            inv_sort_list:"tool",
            generic_type:"Bed",
            desc:"you can sleep on it",
            tier: 0,
            usage:"Equip",
            useitem:(player)=>items.usage.Eat(player),
            stats:[],
            action_stats:[{t:"stat",n:"HP",v:1},{t:"stat",n:"MP",v:1}]
        }
    ]

}
export const actions = {
    nothing:{
        label:"",
        msg:"nothing",
        do:function(player){
        //do nothing
        }
    },
    combat:{
        label:"",
        msg:"fighting",
        do:function(player){

        }
    },
    sleep:{
        label:"",
        msg:"sleeping",
        do:function(player){//sleep from location menu
            let location = player.Current_Location;
            let action_info = locations.area[location.area][location.location].actions.sleep.item;
            player.Restore_Resource(action_info.action_stats);
        }
    },
    rest:{
        label:"Rest",
        msg:"resting",
        do:function(player){//sleep from action menu

        }
    },
    run:{
        label:"Run",
        msg:"running",
        do:function(player){

        }
    }

}

const DA_groups = {
    building:["run"],
    outside:[]
}
export const locations = {
    MoveTo:function(player, location, action){
        //action is usually null, so action gets set to nothing when moving
        player.Current_Location = location;
        player.Current_Action = action ? action : 'nothing';
    },
    EnterCombat:function(){

    },
    OpenShop:function(){

    },
    area:{
        "spawn":{
            location:{x:0,y:0},//for travel time between areas
            "start":{
                top_text:"Unknown: Oh! you finally woke up.",
                get_unlocked_options:function(){
                    //use later for locked options
                    return this.options
                },
                disabled_actions:DA_groups.building,
                options:[
                    {
                        text:'<span style="color: red;">[Area]</span> Leave the building',
                        id:0,
                        click:(player) => locations.MoveTo(player,{area:"spawn",location:"outdoors"})
                    },
                    {
                        text:'<span style="color: green;">[Action]</span> Rest',
                        id:1,
                        click:(player) => locations.MoveTo(player,{area:"spawn",location:"starting_building_bed"}, "sleep")
                    }

                ]
            },
            "starting_building_bed":{
                top_text:"You are Resting",
                get_unlocked_options:function(){
                    return this.options
                },
                actions:{
                    sleep:{item:items.itemlist[7]}
                },
                disabled_actions:"all",
                options:[
                    {
                        text:'<span style="color: green;">[Action]</span> Get up',
                        id:0,
                        click:(player) => locations.MoveTo(player,{area:"spawn",location:"start"})
                    }

                ]
            },
            "outdoors":{
                top_text:"You can see a large mountain, there are a few buildings, and a large wall connecting to the mountain",
                get_unlocked_options:function(){
                    return this.options
                },
                disabled_actions:["none"],
                options:[
                    {
                        text:'<span style="color: red;">[Area]</span> Enter the building',
                        id:0,
                        click:(player) => locations.MoveTo(player,{area:"spawn",location:"start"})
                    }
                ]            
            }
        }
    }
}