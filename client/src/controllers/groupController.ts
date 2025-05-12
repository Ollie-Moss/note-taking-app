import axios from "axios";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";
import { Group } from "../models/group";

export async function GetGroups(uid: string = TEST_UID): Promise<{ groups: Group[], rootGroupIds: string[] }> {
    try {
        const res = await axios.get(`${BASE_URL}/group`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const groups: Group[] = res.data.groups;
        const rootGroupIds: string[] = res.data.rootGroupIds;

        return { groups, rootGroupIds };
    } catch (error: unknown) {
        throw error;
    }
}
