PERMISSIONS_DICT = {
    'admin': [
        'add_user', 'change_user', 'delete_user', 'view_user' ],
    'donor': [],
    'receiver': [],
    'hospital': [],
}
PERMISSIONS_SET_SUCCESS = 'Groups are updated and Permissions set ' \
                          'successfully to all the users.'
GROUP_PERMISSION_INIT = 'Groups permissions initialized...'
USER_PERMISSION_INIT = 'User permissions initialized...'
MAIL_SEND_MESSAGE = "Mail successfully sent: " \
                    "Subject -> {}, Receiver List -> {}"