


export function get_probability_awnser(probability_array){
    let prob_roll = Math.random();
    let prob_sum = 0;
    let awnser;
    probability_array.every((obj)=>{
        if (prob_roll <= (obj.chance + prob_sum)){
            awnser = obj;
            return false;
        }else{
            prob_sum = prob_sum + obj.chance;
            return true;
        }
    });
    return awnser;
}


export const quality = {
    color:function(score){
        if (score < 50) {
            return "rgb(148, 148, 148)";
        }else if(score<100) {
            return "rgb(255,255,255)";
        }else if(score<125) {
            return "rgb(17, 206, 0)";
        }else if(score<150) {
            return "rgb(0, 204, 255)";
        }
    }
}
export const enchants = {
    enchantlist:[
        {
            id:0,
            name:"Low Grade Sharpness Enchant",
            stats:[{t:"stat",n:"str",v:1}],
            tier:0,
            quality:0
        }
    ]
}
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
            stats:[{t:"skill",n:"Mining",v:1},
                {t:"stat",n:"str",v:1}
            ],
            tier: 0,
            quality: 0
        },
        {
            id:1,
            name:"new pickaxe",
            inv_sort_list:"tool",
            generic_type:"Pickaxe",
            equip_slot:"Tool",
            usage:"Equip",
            desc:"A new pickaxe",
            stats:[{t:"skill",n:"Mining",v:2},
                {t:"stat",n:"str",v:5}
            ],
            tier: 1,
            quality: 50
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
            tier: 0,
            quality: 50
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
            tier: 0,
            quality: 0
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
            tier: 0,
            quality: 0
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
            tier: 0,
            quality: 50
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
            stats:[{t:"buff",n:"Hunger",v:150}],
            quality: 0
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
            action_stats:[{t:"stat",n:"HP",v:1},{t:"stat",n:"MP",v:1}],
            quality: 0
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


export const skill = [
    {
        id:0,
        name:"Fighting",
        experience_to_lvl:[100, 500, 2500, 10000, 40000, 100000],
        lvl_rewards:[[{t:"stat",n:"str",v:1}], [{t:"stat",n:"str",v:1}], [{t:"stat",n:"str",v:1}], [{t:"stat",n:"str",v:1}], [{t:"stat",n:"str",v:1}], [{t:"stat",n:"str",v:1}]]
    }
]


export function gain_skill_exp(player, skill, xp){

}

export function calculate_damage(player, damage, typelist){
    let damagelist = [];
    typelist.forEach((type_array)=>{
        let type = type_array.type;
        let plr_type_def = player.HiddenStats[damagetypes[type].defense] || 0;
        let plr_def = player.Stats.def*type_array.portion;
        let type_damage = damage*type_array.portion;
        let total_damage = type_damage-(plr_type_def + plr_def)
        total_damage = total_damage > 0 ? total_damage : 0

        damagelist.push({
            "type":type,
            "damage":total_damage
        });
    });
    return damagelist;
}


export const damagetypes = {
    fire:{
        id:"fire",
        defense:"fire_def",
        skillgains:[]
    },
    blunt:{
        id:"blunt",
        defense:"blunt_def",
        skillgains:[]
    },
    slash:{
        id:"slash",
        defense:"slash_def",
        skillgains:[]
    },
}


export const hiddenstats = {
    fire_def:{
        name:"Fire Defense"
    },
    blunt_def:{
        name:"Blunt Defense"
    },
    slash_def:{
        name:"Slash Defense"
    }
}




export const effects = {
    burn1:{
        name:"Burn"

    }
}



export const combat = {
    allowed_actions:["run"],
    mobs:{
        "testmob":{
            id:"testmob",
            name:"test mob",
            stats:{"str":1,"int":1,"agi":1,"def":0,"spd":1,"HP":5,"HP_Max":5,"Level":0},
            status_effects:[],
            drops:[],
            attacks:[
                {
                    chance:0.2,
                    damage:[1, 3],
                    damage_type:[{type:"fire", portion:0.5}, {type:"slash", portion:0.5}],
                    heal:0,
                    inflict:[{name: "burn1", chance: 0.5, stacks: 10}],
                    self_inflict:[]
                },
                {
                    chance:0.65,
                    damage:[0, 1],
                    damage_type:[{type:"blunt", portion:1}],
                    heal:0,
                    inflict:[],
                    self_inflict:[]
                },
                {
                    chance:0.15,
                    damage:[0, 0],
                    damage_type:[{type:"none", portion:1}],
                    heal:[1, 2],
                    inflict:[],
                    self_inflict:[]
                }
            ]
        },
        "testmob2":{
            id:"testmob2",
            name:"test mob2",
            stats:{"str":1,"int":1,"agi":1,"def":0,"spd":1,"HP":10,"HP_Max":10,"Level":1},
            status_effects:[],
            drops:[],
            attacks:[
                {
                    chance:1,
                    damage:[0, 1],
                    damage_type:[{type:"blunt", portion:1}],
                    heal:0,
                    inflict:[],
                    self_inflict:[]
                }
            ]
        }

    },


    encounters = {
        test:{
            fights:10,
            mobs_per_fight:[{amount:1,chance:1}],
            mob_list_type:"random", //random or fixed
            mobs:[{name:"testmob", chance:0.3},{name:"testmob2", chance:0.7}],
            moblist:null // used for premade fights if list is set to fixed
        },
        test2:{
            fights:10,
            mobs_per_fight:[{amount:2,chance:0.5},{amount:3,chance:0.4},{amount:5,chance:0.1}],
            mob_list_type:"random", //random or fixed
            mobs:[{name:"testmob", chance:0.3},{name:"testmob2", chance:0.7}],
            moblist:null // used for premade fights if list is set to fixed
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
    EnterCombat:function(player, encounter){
        player.Current_Action = "combat";
        const encounter_data = combat.encounters[encounter];

        let moblist = function(){
            if (encounter_data.mob_list_type == "random"){
                let fight_list = [];
                for (let i = 0; i < encounter_data.fights; i++) {
                    let mob_amount = get_probability_awnser(encounter_data.mobs_per_fight).amount;
                    let mobs = [];
                    for (let j = 0; j < mob_amount; j++) {
                        mobs.push(get_probability_awnser(encounter_data.mobs).name);
                    }
                    fight_list.push(mobs);
                }
                return fight_list;
            }else{
                return encounter_data.moblist;
            }
        }();

        player.Current_Combat_Encounter.Current_Fight_Enemy = moblist;
        player.StartFight(true);
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
                        text:'<span style="color: green;">[Area]</span> Enter the building',
                        id:0,
                        click:(player) => locations.MoveTo(player,{area:"spawn",location:"start"})
                    },
                    {
                        text:'<span style="color: red;">[Combat]</span> Test Fight',
                        id:0,
                        click:(player) => locations.EnterCombat(player, "test")
                    }
                ]            
            }
        }
    }
}