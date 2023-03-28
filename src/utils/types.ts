import { ApplicationCommand, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, Client, Collection, MessageComponent, PermissionResolvable } from "discord.js";

export interface ClientType extends Client{
    commands?: Collection<string, CommandType>;
    database?: Promise<typeof import("mongoose")>;
}

export interface CommandType {
    name: string;
    description: string;
    type?: ApplicationCommandType | null;
    options?: Array<CommandOption> | null;
    default_permission?: PermissionResolvable | null;
    default_member_permissions?: PermissionResolvable | null | undefined;
    autocomplete?(client: ClientType, interaction: AutocompleteInteraction): Promise<void>;
    run (client: ClientType, interaction: ChatInputCommandInteraction): Promise<void>;
}
export interface EventType {
    name: string;
    description: string;
    run: (bot: ClientType) => void;
}
export interface CommandOption {
    name: string;
    description: string;
    type: number;
    options?: Array<CommandOption>
    required?: boolean;
    autocomplete?: boolean;
}