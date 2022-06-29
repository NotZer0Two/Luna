const Guild = require('../database/schemas/Guild')

//fix put it after because im returning them 

module.exports = class CustomPermission {
    constructor(guild, usertopex) {
        this.guild = guild
        this.usertopex = usertopex
    }

    async addPermission(permission) {
        let status = false;

        const guildraw = await Guild.findOne({
            Id: this.guild
        });

        if (guildraw) {
            const check = guildraw?.customPermission.find(x => x?.usertopex === this.usertopex);
            if (check) {
                const arr = guildraw.customPermission.filter(x => x.usertopex !== this.usertopex)
                arr.push({
                    usertopex: this.usertopex,
                    permission: [...new Set([permission,...check.permission])]
                });
                guildraw.customPermission = arr

                await guildraw.save().then(() => {
                    status = true
                });
            } else {
                guildraw.customPermission.push({
                    usertopex: this.usertopex,
                    permission: [permission]
                });
                await guildraw.save().then(() => {
                    status = true
                });
            }
        }

        return status;
    }

    async checkPermission(permission) {
        //check if the permission is in the array make it promise
        let status = false;

        const guildraw = await Guild.findOne({
            Id: this.guild
        })

        if (guildraw) {
            for (const element of guildraw?.customPermission ?? []) {
                if (element?.usertopex !== this.usertopex) break;
                if (element?.permission?.includes(permission)) {
                    status = true;
                    break;
                }
                continue;
            }
        }

        return status
    }

    async getPermissionList() {
        let status = "";
        //return the array of permissions
        const guildraw = await Guild.findOne({
            Id: this.guild
        })
        if (!guildraw) return;
        let check = guildraw.customPermission.find(x => x.usertopex == this.usertopex)
        if (check.permission) {
            status = check.permission.join(", ")
        } else {
            status = "No Permissions"
        }

        return status
    }

    async removePermission(permission) {
        let status = false;

        const guildraw = await Guild.findOne({
            Id: this.guild
        });

        if (guildraw) {
            const check = guildraw?.customPermission.find(x => x?.usertopex === this.usertopex);
            if (check) {
                const arr = guildraw.customPermission.filter(x => x.usertopex !== this.usertopex)
                arr.push({
                    usertopex: this.usertopex,
                    //remove the permission from the array
                    permission: check.permission.filter(x => x !== permission)
                });
                guildraw.customPermission = arr
                
                await guildraw.save().then(() => {
                    status = true
                });
            }
            else {
                status = false
            }
        }

        return status;
    }

}