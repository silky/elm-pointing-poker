module Login.Update exposing (update)

import Login.Commands exposing (fbJoinRoom)
import Login.Messages exposing (Msg(..))
import Login.Models exposing (Login)

update : Msg -> Login -> ( Login, Cmd Msg )
update msg login =
    case msg of
        LoginUpdate a ->
            ( login, Cmd.none )

        EditRoomName name ->
            ( { login | roomName = name}, Cmd.none)

        EditUserName name ->
            ( { login | userName = name}, Cmd.none)

        SubmitForm ->
            -- TODO: Add validation
            ( {login | isValid = True}, fbJoinRoom login.userName)