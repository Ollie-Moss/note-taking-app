import axios from "axios";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";
import { Note } from "../models/note";
import { Group } from "../models/group";

export async function GetGroups(uid: string = TEST_UID): Promise<Group[]> {
    try {
        const res = await axios.get(`${BASE_URL}/group`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const groups: Group[] = res.data.groups;

        return groups.map((group: Group) => {
            return {
                ...group, notes: group.notes.map((note: Note) => {
                    return {
                        ...note,
                        editedAt: new Date(note.editedAt)
                    }
                })
            }
        });
    } catch (error: unknown) {
        throw error;
    }
}
