import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.mj.aora',
    projectId: '6635fc84001e6b26a8b9',
    databaseId: '6635ff66000d4f0ff528',
    userCollectionId: '6635ff910004a14d370b',
    videoCollectionId: '6635ffdb002d1db74512',
    storageId: '6636017e002cfebb86c2'
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform); 


const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async(email, password, username)=>{
try {
    const newAccount = await account.create(ID.unique(), email, password, username)
    if (!newAccount) throw Error
    const avatarUrl = avatars.getInitials(username)
    await signIn(email, password)
    const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
    })
    return newUser
} catch (error) {
    console.log(error)
    throw new Error(error)
}
}

export const signIn = async(email, password)=>{
    try {
       const session = await account.createEmailSession(email, password)
       return session 
    } catch (error) {
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if(!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser){
            throw Error
        }
        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}